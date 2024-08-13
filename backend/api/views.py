from django.shortcuts import render
from rest_framework import generics,status
from .serializers import UserSerializer, MessageSerializer,ProductSerializer, LoginSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Message , Product, CustomUser
from django.db.models import Q
from rest_framework.response import Response

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class EditUserView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Simpan referensi ke user sebelum update
        user = self.get_object()

        # Panggil metode update parent untuk menangani update
        response = super().update(request, *args, **kwargs)

        refresh = RefreshToken.for_user(user)
        
        # Custom payload
        refresh['email'] = user.email
        refresh['username'] = user.username
        if user.profile_picture:
            profile_picture_url = request.build_absolute_uri(user.profile_picture.url)
        else:
            profile_picture_url = None
        refresh['profile_picture'] = profile_picture_url
        access_token = refresh.access_token

        # Return the new tokens along with the original response data
        response.data['refresh'] = str(refresh)
        response.data['access'] = str(access_token)
        response.data['message'] = 'User information updated successfully'

        return response 
    
class DeleteUserView(generics.DestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CreateMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(sender=self.request.user)
        else:
            print(serializer.errors)

class MessageDeleteView(generics.DestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user)
    
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user))
    
class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
        else:
            print(serializer.errors)
class DeleteProductView(generics.DestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)
    
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

class AllProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.all()
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Pass the request context to the token serializer
        CustomTokenObtainPairSerializer.context = {'request': request}
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response(tokens, status=status.HTTP_200_OK)