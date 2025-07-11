from rest_framework import serializers
from .models import Member, Individual, Organization, VLXD, Post, Folder, Comment
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class IndividualSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='name.id')  # Reference to the Member's id
    name = serializers.CharField(source='name.username')  # Reference to the Member's username

    class Meta:
        model = Individual
        fields = ['id', 'name', 'phone', 'email']


class OrganizationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='name.id')  # Reference to the Member's id
    name = serializers.CharField(source='name.username')  # Reference to the Member's username

    class Meta:
        model = Organization
        fields = ['id', 'name', 'tax_num', 'phone', 'email']


class VLXDSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='name.id')  # Reference to the Member's id
    name = serializers.CharField(source='name.username')  # Reference to the Member's username

    class Meta:
        model = VLXD
        fields = ['id', 'name', 'phone', 'email', 'job']


class MemberSerializer(serializers.ModelSerializer):
    is_individual = serializers.BooleanField(read_only=True)
    is_organization = serializers.BooleanField(read_only=True)
    is_vlxd = serializers.BooleanField(read_only=True)
    rank = serializers.IntegerField()  

    name = serializers.CharField(source='individual.name')
    phone = serializers.CharField(source='individual.phone')
    email = serializers.EmailField(source='individual.email')
    
    company_name = serializers.CharField(source='organization.name')
    tax_num = serializers.CharField(source='organization.tax_num')
    organization_phone = serializers.CharField(source='organization.phone')
    organization_email = serializers.EmailField(source='organization.email')
    
    job = serializers.CharField(source='vlxd.job', read_only=True)

    class Meta:
        model = Member
        fields = ['id', 'is_individual', 'is_organization', 'is_vlxd', 'rank', 'name', 'phone', 'email', 'company_name', 'tax_num', 'organization_phone', 'organization_email', 'job']
        read_only_fields = ['username', 'individual', 'organization']
    def to_representation(self, instance):
        """
        Conditionally change the fields depending on the Member type
        """
        # Call the parent method to get the initial representation
        representation = super().to_representation(instance)

        # Remove unnecessary fields based on the flags
        if instance.is_individual:
            # Keep only the individual-specific fields
            return {key: representation[key] for key in ['id', 'name', 'phone', 'email', 'rank', 'is_individual']}
        elif instance.is_organization:
            # Keep only the organization-specific fields
            return {key: representation[key] for key in ['id', 'company_name', 'tax_num', 'organization_phone', 'organization_email', 'rank', 'is_organization']}
        elif instance.is_vlxd:
            # Keep only the VLXD-specific fields
            return {key: representation[key] for key in ['id', 'name', 'phone', 'email', 'job', 'rank', 'is_vlxd']}
        
        return representation
    
    def update(self, instance, validated_data):
        """
        Custom update logic for Individual or Organization based on Member type.
        """
        if instance.is_individual and 'individual' in validated_data:
            individual_data = validated_data.pop('individual')
            Individual.objects.filter(name=instance).update(**individual_data)

        if instance.is_organization and 'organization' in validated_data:
            organization_data = validated_data.pop('organization')
            Organization.objects.filter(name=instance).update(**organization_data)

        return instance

class FolderSerializer(serializers.ModelSerializer):
    layer = serializers.SerializerMethodField()  # Add the layer field

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent', 'can_have_posts', 'layer']

    def get_layer(self, obj):
        """
        Calculate and return the layer of the folder.
        """
        layer = 1
        current = obj.parent
        while current:
            layer += 1
            current = current.parent
        return layer


class PostSerializer(serializers.ModelSerializer):
    folder = FolderSerializer()  # Serialize folder information
    name = serializers.CharField(read_only=True)
    like_count = serializers.SerializerMethodField()  # Add like count
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'picture', 'name', 'title', 'caption', 'folder', 'created_at', 'updated_at', 'like_count', 'is_liked']
        read_only_fields = ['id', 'created_at', 'updated_at', 'name', 'like_count', 'is_liked']

    def get_like_count(self, obj):
        return obj.like_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)  # Check if the user liked the post
        return False

    def validate(self, data):
        """
        Ensure the post has a title and caption.
        """
        if not data.get('title'):
            raise serializers.ValidationError("Title is required.")
        if not data.get('caption'):
            raise serializers.ValidationError("Caption is required.")
        return data

    def create(self, validated_data):
        """
        Override the create method to set the 'name' field as the username of the member creating the post.
        """
        user = self.context['request'].user
        validated_data['name'] = user.username
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Prevent updating the 'name' field.
        """
        validated_data.pop('name', None)
        return super().update(instance, validated_data)
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Use the `__str__` method of the User model
    username = serializers.CharField(source='user.username', read_only=True)  # Explicitly add the username field

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
