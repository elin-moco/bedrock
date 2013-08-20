# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order
#     * Make sure each model has one field with primary_key=True
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.
from datetime import datetime
from django.db import models


class Bbs(models.Model):
    id = models.IntegerField(primary_key=True)
    pair_key = models.TextField()
    pair_lock = models.TextField()
    actived = models.IntegerField()
    edit_date = models.DateField()

    class Meta:
        db_table = u'bbs'


class Imagedata(models.Model):
    id = models.IntegerField(primary_key=True)
    filename = models.CharField(max_length=60)
    u_email = models.CharField(max_length=300, blank=True)
    upload_date = models.DateTimeField()

    class Meta:
        db_table = u'imagedata'


class Newsletter(models.Model):
    id = models.IntegerField(primary_key=True)
    u_email = models.TextField(blank=False)
    u_status = models.IntegerField(default=1)
    edit_date = models.DateField(default=datetime.now)

    class Meta:
        db_table = u'newsletter'
