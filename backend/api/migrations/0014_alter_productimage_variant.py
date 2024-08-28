# Generated by Django 5.1 on 2024-08-28 04:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_product_image_productimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productimage',
            name='variant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.variant'),
        ),
    ]