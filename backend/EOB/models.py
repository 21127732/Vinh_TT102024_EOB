
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.conf import settings  # To reference the custom Member model
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

# Member model
class Member(AbstractUser):
    is_individual = models.BooleanField(default=False)
    is_organization = models.BooleanField(default=False)
    is_vlxd = models.BooleanField(default=False)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        verbose_name="Profile Picture"
    )
    rank = models.PositiveIntegerField(
        default=1,
        choices=[
            (1, 'Star'),
            (2, 'Pro'),
            (3, 'VIP'),
        ]
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='member_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='member_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def clean(self):
        types_selected = sum([self.is_individual, self.is_organization, self.is_vlxd])
        if types_selected > 1:
            raise ValidationError("A member can only be one of: Individual, Organization, or VLXD.")

# Individual model
class Individual(models.Model):
    name = models.OneToOneField(Member, on_delete=models.CASCADE, primary_key=True)
    phone = models.CharField("Phone", max_length=50)
    email = models.EmailField(unique=True)  # Enforce unique email if each account should be unique

    def __str__(self):
        return f"Individual: {self.name}"

# Organization model
class Organization(models.Model):
    name = models.OneToOneField(Member, on_delete=models.CASCADE, primary_key=True, verbose_name='Company Name')
    tax_num = models.CharField(max_length=10, verbose_name='Tax Number')
    phone = models.CharField("Phone", max_length=50)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"Organization: {self.name}"

# VLXD model
class VLXD(models.Model):
    name = models.OneToOneField(Member, on_delete=models.CASCADE, primary_key=True, verbose_name='Company Name')
    phone = models.CharField("Phone", max_length=50)
    email = models.EmailField(unique=True)
    job = models.CharField("Job Title", max_length=50)

    def __str__(self):
        return f"VLXD Company: {self.name}"

class Folder(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE, related_name='subfolders'
    )
    can_have_posts = models.BooleanField(default=False)

    class Meta:
        unique_together = ('name', 'parent')

    def __str__(self):
        return self.name

    def get_layer(self):
        """
        Calculate the layer (depth) of the folder by traversing its parents.
        """
        layer = 1
        current = self.parent
        while current:
            layer += 1
            current = current.parent
        return layer
    
    def get_full_path(self):
       
        path = []
        current_folder = self
        while current_folder is not None:
            path.insert(0, current_folder.name)
            current_folder = current_folder.parent
        return '/'.join(path)

    def save(self, *args, **kwargs):
        """
        Override the save method to set `can_have_posts` for Layer 3 and above.
        """
        # Determine the layer
        layer = self.get_layer()

        # Allow posts for Layer 3 and above
        self.can_have_posts = (layer >= 3)

        super().save(*args, **kwargs)

# Signals for keeping parent folders updated
@receiver(post_save, sender=Folder)
def update_parent_on_save(sender, instance, **kwargs):
    if instance.parent:
        parent = instance.parent
        parent.can_have_posts = parent.get_layer() >= 3
        parent.save()

@receiver(pre_delete, sender=Folder)
def update_parent_on_delete(sender, instance, **kwargs):
    if instance.parent:
        parent = instance.parent
        parent.can_have_posts = parent.get_layer() >= 3
        parent.save()

# Post model
class Post(models.Model):
    picture = models.ImageField(
        upload_to='post_pictures/',
        blank=True,
        null=True
    )
    name = models.CharField(max_length=255, verbose_name="Posted by")
    title = models.CharField(max_length=100, verbose_name="Post Title")
    caption = models.TextField(verbose_name="Post Caption")
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_posts",
        blank=True
    )
    folder = models.ForeignKey(
        Folder,
        on_delete=models.CASCADE,
        related_name="posts",
        default=1  # Replace 1 with the ID of the default folder
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_liked_by(self, member):
        # Check if a specific member has liked this post
        if member and member.is_authenticated:
            return self.likes.filter(pk=member.pk).exists()
        return False

    def like_count(self):
        # Returns the total number of likes
        return self.likes.count()

    def clean(self):
        # Validate that the folder is a valid year folder under a valid material folder
        if not self.folder.is_valid_location():
            raise ValidationError("Posts must be located in a valid year folder (e.g., '2024', '2025') under a material folder.")

    def __str__(self):
        return f"{self.title} by {self.name}"

class Comment(models.Model):
    post = models.ForeignKey(
        Post, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )  # Links the comment to a specific post
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )  # Links the comment to a specific user
    text = models.TextField()  # Stores the comment text
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the comment is created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for when the comment is last updated

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"