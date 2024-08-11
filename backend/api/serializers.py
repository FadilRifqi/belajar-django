from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Message,Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) 
        return user

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'message', 'file', 'timestamp']
        extra_kwargs = {'sender': {'read_only': True}}

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'owner', 'image', 'timestamp']
        extra_kwargs = {'owner': {'read_only': True}}       
