# Generated by Django 2.0.5 on 2019-07-04 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='video_url',
            field=models.URLField(max_length=500),
        ),
    ]
