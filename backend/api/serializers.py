from rest_framework import serializers
from .models import Message,Product,CustomUser,Order,Variant,ProductImage
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import json

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

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'variant', 'image']
        extra_kwargs = {'variant': {'read_only': True}}

class VariantSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    class Meta:
        model = Variant
        fields = ['id', 'name', 'price', 'stock','images']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'description', 'owner', 'timestamp', 'variants']
        extra_kwargs = {'owner': {'read_only': True}}

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        product = Product.objects.create(**validated_data)
        for variant_data in variants_data:
            images_data = variant_data.pop('images', [])
            variant = Variant.objects.create(product=product, **variant_data)
            for image_data in images_data:
                ProductImage.objects.create(variant=variant, **image_data)
        return product

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
