from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, IndividualViewSet, OrganizationViewSet, VLXDViewSet, TokenListView
from .views import GenericPostCreateView


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'individuals', IndividualViewSet)
router.register(r'organizations', OrganizationViewSet)
router.register(r'vlxd', VLXDViewSet)

urlpatterns = [
    path('', views.Base, name='Base'),
    path('EOB/', views.Homepage, name='Homepage'),

    path('', include(router.urls)),
    path('api/signup_vlxd', views.Signup_VLXD, name='signup_vlxd'),
    path('api/signup_mem', views.Signup_mem, name='signup_mem'),

    path('api/login', views.Login, name='login'),
    path('api/google-login', views.google_login, name='google-login'),
    path('api/logout', views.Logout, name='logout'),  
    path('api/user', views.UserView.as_view(), name='user'),
    path('api/member', views.UserView.as_view(), name='member'),
    path('api/members/<str:username>/', MemberViewSet.as_view({'put': 'update'}), name='update_user_data'),
    
    path('api/password-reset/', views.password_reset_request, name='password_reset_request'),
    path('api/password-reset-confirm/<uidb64>/<token>/', views.password_reset_confirm, name='password_reset_confirm'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Verify token
    path('api/token/list', TokenListView.as_view(), name='token_list'),

    path('api/folders/', views.get_folders, name='get_folders'),
    path('api/folders/<int:folder_id>/path/', views.get_folder_path, name='get_folder_path'),
    path('api/folders/populate/', views.populate_folder_tree, name='populate_folder_tree'),

    path('api/posts/create/', views.create_post, name='create_post'),
     path('api/posts/view_create/', GenericPostCreateView.as_view(), name='generic_create_post'),
    path('api/posts/', views.get_posts, name='get_posts'),
    path('api/posts/<int:post_id>', views.detail_posts, name='detail_posts'),
    path('api/posts/<int:post_id>/like/', views.like_post, name='like_post'),  # URL for liking a post
    path('api/posts/<int:post_id>/check-like/', views.check_like, name='check_like'),

    path('api/posts/<int:post_id>/comments/', views.list_comments, name='list_comments'),
    path('api/posts/<int:post_id>/comments/create/', views.create_comment, name='create_comment'),

   
]