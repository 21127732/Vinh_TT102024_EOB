# Generated by Django 5.1.2 on 2024-10-22 08:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('EOB', '0002_rename_full_name_individual_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='individual',
            old_name='user',
            new_name='full_name',
        ),
    ]
