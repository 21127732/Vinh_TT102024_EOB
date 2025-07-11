from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Member, Individual, Organization, VLXD, Post, Folder


class MemberAdmin(UserAdmin):
    """
    Custom admin for the Member model, including fields for member type and rank.
    """
    fieldsets = UserAdmin.fieldsets + (
        ('Member Details', {
            'fields': ('is_individual', 'is_organization', 'is_vlxd', 'rank')
        }),
    )
    list_display = ('username', 'email', 'is_individual', 'is_organization', 'is_vlxd', 'rank')
    list_filter = ('is_individual', 'is_organization', 'is_vlxd', 'rank')


@admin.register(Individual)
class IndividualAdmin(admin.ModelAdmin):
    """
    Admin for the Individual model.
    """
    list_display = ('name', 'phone', 'email')
    search_fields = ('name__username', 'phone', 'email')  # Supports searching by the related Member username


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """
    Admin for the Organization model.
    """
    list_display = ('name', 'tax_num', 'phone', 'email')
    search_fields = ('name__username', 'tax_num', 'phone', 'email')


@admin.register(VLXD)
class VLXDAdmin(admin.ModelAdmin):
    """
    Admin for the VLXD model.
    """
    list_display = ('name', 'phone', 'email', 'job')
    search_fields = ('name__username', 'phone', 'email', 'job')


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    """
    Admin for the Folder model.
    """
    list_display = ('name', 'parent')
    search_fields = ('name',)
    list_filter = ('parent',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """
    Admin for the Post model.
    """
    list_display = ('title', 'name', 'folder', 'created_at', 'updated_at', 'like_count_display')
    list_filter = ('folder', 'created_at', 'updated_at')
    search_fields = ('title', 'name', 'folder__name')
    readonly_fields = ('like_count_display',)

    def like_count_display(self, obj):
        """
        Display the like count in the admin.
        """
        return obj.like_count()

    like_count_display.short_description = 'Like Count'


# Register the Member model with the custom MemberAdmin
admin.site.register(Member, MemberAdmin)
