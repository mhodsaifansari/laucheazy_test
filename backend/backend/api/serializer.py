from rest_framework import serializers
from django.contrib.auth.models import User

class AccountSeralizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','id','first_name','last_name','username']