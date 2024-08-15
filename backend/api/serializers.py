from rest_framework import serializers
from .models import Message,Product,CustomUser,Order
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','profile_picture' ,'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data) 
        return user

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'message', 'file', 'timestamp']
        extra_kwargs = {'sender': {'read_only': True}}

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'price', 'owner', 'image', 'timestamp']
        extra_kwargs = {'owner': {'read_only': True}}       

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Must include "email" and "password".')

        # Authenticate using the email as the username
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid login credentials')

        # Add the authenticated user to the validated data
        data['user'] = user
        return data

    def create(self, validated_data):
        user = validated_data['user']  # Accessing the user added in validate
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        # Construct full URL for profile picture
        request = cls.context.get('request')
        if user.profile_picture:
            profile_picture_url = request.build_absolute_uri(user.profile_picture.url)
        else:
            profile_picture_url = None
        token['profile_picture'] = profile_picture_url

        return token
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_price','payment_status','payment_amount','payment_date','transaction_id', 'payment_method', 'created_at']
        extra_kwargs = {'user': {'read_only': True}}