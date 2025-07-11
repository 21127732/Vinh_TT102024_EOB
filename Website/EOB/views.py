# Django imports
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.hashers import make_password # type: ignore
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from django.core.mail import send_mail


# Django REST Framework imports
from rest_framework import viewsets, status , permissions, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import CreateAPIView

from datetime import timedelta, datetime

# Model imports
from EOB.models import Member, Individual, Organization, VLXD, Post, Folder, Comment

# Serializer imports
from .serializers import MemberSerializer, IndividualSerializer, OrganizationSerializer, VLXDSerializer, PostSerializer, FolderSerializer, CommentSerializer

#Other import       
import json
from google.auth.transport.requests import Request
from google.oauth2.id_token import verify_oauth2_token
from google.oauth2 import id_token
from google.auth.transport import requests

# Use get_user_model to refer to your custom Member model
Member = get_user_model()

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    

    def get_permissions(self):

        if self.action == 'list':
             # Only allow admins to list all users
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def list(self, request):
        """
        List all members, restricted to admin users only.
        """
        members = self.queryset
        serializer = self.serializer_class(members, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
       
        member = get_object_or_404(self.queryset, username=pk)  
        serializer = self.serializer_class(member)
        return Response(serializer.data)
    
    def get_object(self):
        """
        Override `get_object` to retrieve the member using the `username` instead of `pk`.
        """
        username = self.kwargs.get('username')
        return get_object_or_404(self.queryset, username=username)

    def update(self, request, *args, **kwargs):
        """
        Update a member's details based on the username.
        """
        member = self.get_object()  # Use the custom `get_object` method
        serializer = self.serializer_class(member, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IndividualViewSet(viewsets.ModelViewSet):
    queryset = Individual.objects.all()
    serializer_class = IndividualSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer


class VLXDViewSet(viewsets.ModelViewSet):
    queryset = VLXD.objects.all()
    serializer_class = VLXDSerializer

class GenericPostCreateView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        folder_path = self.request.data.get('folder')

        if not folder_path:
            raise ValidationError({"error": "Folder path is required."})

        # Parse folder path and get or create folders
        folder_names = folder_path.split('/')
        parent_folder = None
        for name in folder_names:
            folder, created = Folder.objects.get_or_create(name=name, parent=parent_folder)
            parent_folder = folder

        # Save the post with the parent folder and user
        serializer.save(name=self.request.user.username, folder=parent_folder)

@api_view(['POST'])
@permission_classes([IsAdminUser])  # Restrict to admins
def populate_folder_tree(request):
    """
    Populate the folder tree into the database following the exact structure in Folder.jsx.
    """

    def create_folders_recursively(folders, parent=None):
        """
        Recursive function to create folders and subfolders.
        """
        for folder in folders:
            folder_obj, _ = Folder.objects.get_or_create(name=folder['name'], parent=parent)
            if 'subfolders' in folder and folder['subfolders']:
                create_folders_recursively(folder['subfolders'], parent=folder_obj)

    # Folder structure as defined in Folder.jsx
    folder_structure = [
        {
            "name": "EOB",
            "subfolders": [
                {
                    "name": "Việt Nam",
                    "subfolders": [
                        {
                            "name": software_name,
                            "subfolders": [
                                {
                                    "name": "Vật liệu xây dựng",
                                    "subfolders": [
                                        {"name": "Mặt dựng và trần nhôm Austra Alu"},
                                        {"name": "Sơn trang trí Dulux"},
                                        {"name": "Tấm cách âm cách nhiệt Phương Nam panel"},
                                    ],
                                },
                                {"name": "Kiến trúc", "subfolders": []},
                                {"name": "Kết cấu", "subfolders": []},
                                {"name": "MEP", "subfolders": []},
                            ],
                        }
                        for software_name in ["Revit", "Auto CAD", "Sketch UP", "Tekla", "Archi CAD"]
                    ],
                },
                {
                    "name": "BIM-VietNam",
                    "subfolders": [
                        {
                            "name": "ISO-19650",
                            "subfolders": [
                                {"name": "ISO-19650-AP01"},
                            ],
                        }
                    ],
                },
            ],
        }
    ]

    try:
        # Create the folder tree in the database
        create_folders_recursively(folder_structure)
        return Response({"success": True, "message": "Folder tree populated successfully."}, status=201)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)

        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        # Extract data from request
        title = request.data.get('title')
        caption = request.data.get('caption')
        picture = request.FILES.get('picture')
        folder_id = request.data.get('folder')

        # Validate folder
        folder = Folder.objects.filter(id=folder_id).first()
        if not folder:
            return Response({"error": "Invalid folder ID."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the post
        post = Post.objects.create(
            name=request.user.username,
            title=title,
            caption=caption,
            picture=picture,
            folder=folder
        )

        serializer = PostSerializer(post, context={'request': request})
        return Response({
            "post": serializer.data,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_folders(request):
    """
    Retrieve the entire folder hierarchy, including `layer` and `can_have_posts`.
    """
    def fetch_folder_hierarchy(folder):
        """
        Recursively fetch subfolders for a given folder.
        """
        serializer = FolderSerializer(folder)
        folder_data = serializer.data
        subfolders = Folder.objects.filter(parent=folder)
        folder_data['subfolders'] = [
            fetch_folder_hierarchy(subfolder) for subfolder in subfolders
        ]
        return folder_data

    try:
        # Fetch top-level folders
        top_level_folders = Folder.objects.filter(parent=None)
        folder_hierarchy = [fetch_folder_hierarchy(folder) for folder in top_level_folders]
        return Response(folder_hierarchy, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_folder_path(request, folder_id):
    """
    Retrieve the full path of a folder by its ID.
    """
    try:
        # Fetch the folder by ID
        folder = get_object_or_404(Folder, id=folder_id)

        # Get the full path using the `get_full_path` method
        full_path = folder.get_full_path()

        return Response({'id': folder.id, 'name': folder.name, 'full_path': full_path}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def get_posts(request):
    """
    Retrieve all posts and include like status for the current user.
    """
    try:
        folder_id = request.GET.get('folder_id', None)  # Get folder_id from request
        if folder_id:
            posts = Post.objects.filter(folder_id=folder_id)  # Filter by folder ID
        else:
            posts = Post.objects.all()

        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"detail": "No posts found."}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_like(request, post_id):
    """
    Check if the current authenticated user has liked the specified post.
    """
    try:
        # Retrieve the post by its ID
        post = get_object_or_404(Post, id=post_id)

        # Check if the user has liked the post
        is_liked = post.is_liked_by(request.user)

        # Return the response with the result
        return Response({'is_liked': is_liked}, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        member = request.user
        
        # Toggle like
        if member in post.likes.all():
            post.likes.remove(member)  # Unlike
            is_liked = False
        else:
            post.likes.add(member)  # Like
            is_liked = True
        
        post.save()
        return Response({'like_count': post.like_count(), 'is_liked': is_liked}, status=status.HTTP_200_OK)
    
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def detail_posts(request, post_id):
    """
    Retrieve the details of a specific post.
    """
    try:
        # Fetch the post by ID
        post = get_object_or_404(Post, id=post_id)

        # Serialize the post data
        serializer = PostSerializer(post, context={'request': request})

        # Include additional fields (like count, is_liked) if needed
        post_data = serializer.data
        post_data['like_count'] = post.like_count()  # Total likes for the post

        # Check if the current user has liked the post (if authenticated)
        if request.user.is_authenticated:
            post_data['is_liked'] = post.is_liked_by(request.user)  # Check if the user liked the post
        else:
            post_data['is_liked'] = False

        return Response(post_data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    text = request.data.get('text')
    if not text:
        return Response({'error': 'Comment text is required.'}, status=400)

    try:
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.create(post=post, user=request.user, text=text)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=201)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found.'}, status=404)

@api_view(['GET'])
def list_comments(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found.'}, status=404)

@api_view(['POST'])
@csrf_exempt  # If needed, you can use csrf_exempt, but ensure CSRF protection is handled securely
def Signup_VLXD(request):
    if request.method == 'POST':
        # Debug: Print the incoming data to verify it's correctly received
        print("Received data:", request.data)

        cname = request.data.get('cname')
        phone = request.data.get('phone')
        email = request.data.get('email')
        job = request.data.get('job')
        checkbox = request.data.get('checkbox')
        try:
            # Create user
            user = Member.objects.create_user(username=cname, password=make_password('temporarypassword'), email=email)
            user.is_vlxd = True
            user.save()

            # Create VLXD profile
            VLXD_User = VLXD.objects.create(name=user, phone=phone, email=email, job=job)
            VLXD_User.save()

            # Return success response
            return JsonResponse({'message': 'Đăng ký thành công!'}, status=201)  # 201 for created status

        except Exception as e:
            # Log the error details for debugging purposes
            print(f"Error during signup: {e}")
            return JsonResponse({"error": "Đã có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại."}, status=500)

    return JsonResponse({'error': 'Yêu cầu không hợp lệ'}, status=400)

@api_view(['POST'])
@csrf_exempt
def Signup_mem(request):
    if request.method == "POST":
        # Debug: Print the incoming data to verify it's correctly received
        print("Received data:", request.data)

        # Extract common data
        member_type = request.data.get("member_type")
        phone = request.data.get("phone")
        email = request.data.get("email")
        password = request.data.get("pass")
        r_password = request.data.get("rpass")

        print(member_type, phone, email, password, r_password)

        try:
            # Set a default username depending on member type
            if member_type == "individual":
                print(f"Creating individual user")
                name = request.data.get("uname")
                user = Member.objects.create_user(username=name, email=email, password=password)
                print(name, email )
                user.is_individual = True
                user.save()
                print(f"Individual user created with ID: {user.id}")

                # Create Individual profile and link to user
                individual_profile = Individual.objects.create(name=user, phone=phone, email=email)
                print(phone, email )
                individual_profile.save()
                print(f"Individual profile created with ID: {individual_profile.id}")

            elif member_type == "organization":
                print(f"Creating organization user")
                name = request.data.get("c_name")
                tax = request.data.get("tax")
                user = Member.objects.create_user(username=name, email=email, password=password)
                user.is_organization = True
                user.save()
                print(f"Organization user created with ID: {user.id}")

                # Create Organization profile and link to user
                organization_profile = Organization.objects.create(name=user, tax_num=tax, phone=phone, email=email)
                organization_profile.save()
                print(f"Organization profile created with ID: {organization_profile.id}")

            # Serialize the user and return the response
            user_serializer = MemberSerializer(user)
            return Response({'message': 'Signup successful!', 'user': user_serializer.data}, status=201)

        except Exception as e:
            # Log error details for debugging purposes
            print(f"Error during signup: {e}")
            return JsonResponse({'success': False, 'errors': [str(e)]}, status=500)

    # Handle non-POST requests
    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=400)

@api_view(['POST'])
def Login(request):
    uname = request.data.get('uname')
    password = request.data.get('pass')
    remember_me = request.data.get('checkbox', False)

    # Authenticate the user
    user = authenticate(request, username=uname, password=password)
  
    if user is not None:
        if user.is_individual or user.is_organization:  # Assuming these are valid attributes
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            # Adjust token lifetime if "remember_me" is checked
            if remember_me:
                refresh.set_exp(lifetime=timedelta(days=7))  # Extend token lifetime

            return Response({
                'success': True,
                'message': 'Login successful.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                'username': user.username,
                'email': user.email,
                }   
            })
        else:
            return Response({'success': False, 'message': 'This user is not authorized to log in.'}, status=403)
    else:
        return Response({'success': False, 'message': 'Login failed. User does not exist.'}, status=400)

@csrf_exempt
def google_login(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            token = body.get('token')

            if not token:
                return JsonResponse({'success': False, 'message': 'Token not provided.'}, status=400)

            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            

            # Extract user information
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            name = last_name + ' ' + first_name
            print(f"User: {name}")

            # Check if the user already exists by email
            user = Member.objects.filter(email=email).first()

            if user:
                # If the user exists, log them in
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'success': True,
                    'message': 'Google login successful.',
                    'token': token,
                    'email': email,
                    'username': user.username,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                })
            else:
                # If the user does not exist, create a new one
                user = Member.objects.create_user(
                    username=name, email=email, first_name=first_name, last_name=last_name
                )
                user.is_individual = True
                user.save()
                individual_profile = Individual.objects.create(name=user, email=email)
                individual_profile.save()

                # Log in the newly created user
                refresh = RefreshToken.for_user(user)

            return JsonResponse({
                'success': True,
                'message': 'Google login successful.',
                'token': token,
                'email': email,
                'username': user.username,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        except ValueError as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@api_view(['POST'])
def Logout(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
            return Response({'success': False, 'message': 'Refresh token is required.'}, status=400)

    try:
            # Log out the user (this will remove session information)
            logout(request)

            # Handle the refresh token to blacklist it
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token

            return Response({'success': True, 'message': 'Logged out successfully.'})
    except Exception as e:
            return Response({'success': False, 'message': 'Invalid token or logout failed.'}, status=400)
    
class UserView(APIView):
    def get(self, request, *args, **kwargs):
        """
        Returns the current authenticated user's information
        """
        user = request.user  # The user is available in the request object after authentication
        # You can customize the response to include only necessary user data
        user_data = {
            'username': user.username,
            'email': user.email,
            # Add any other fields you need here
        }
        return Response(user_data, status=status.HTTP_200_OK)

# Token view
class TokenListView(APIView):
    def get(self, request):
        users = Member.objects.all()
        data = []

        for user in users:
            refresh = RefreshToken.for_user(user)
            data.append({
                'username': user.username,
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
            })

        return Response(data)


@api_view(['GET'])
def protected_view(request):
    return Response({'message': 'This is a protected view!'})


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Member.objects.get(email=email)
    except Member.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    reset_url = request.build_absolute_uri(reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token}))

    send_mail(
        'Password Reset Request',
        f'Click the link below to reset your password:\n\n{reset_url}',
        'no-reply@yourdomain.com',
        [email],
    )

    return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = Member.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, Member.DoesNotExist):
        return Response({"error": "Invalid link."}, status=status.HTTP_400_BAD_REQUEST)

    token_generator = PasswordResetTokenGenerator()
    if not token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not new_password or not confirm_password:
        return Response({"error": "Both new password and confirmation are required."}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)



# Regular Django views


def Base(request):
    return render(request, 'Base.html')


def Homepage(request):
    return render(request, 'Homepage.html')





