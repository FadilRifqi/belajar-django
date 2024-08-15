from django.shortcuts import render
from rest_framework import generics,status
from .serializers import UserSerializer, MessageSerializer,ProductSerializer, LoginSerializer, CustomTokenObtainPairSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Message , Product, CustomUser,Cart,CartItem,Order
from django.db import transaction
from django.db.models import Q
from rest_framework.response import Response

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = CustomUser.objects.get(email=request.data['email'])
        cart = Cart.objects.create(user=user)
        cart.save()
        response.data['message'] = 'User created successfully'
        return response
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

    
class ProductPagination(PageNumberPagination):
    page_size = 10  # Number of products per page
    page_size_query_param = 'page_size'
    max_page_size = 100
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ProductPagination

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

class AllProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.order_by('?')
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

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
class UserCartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_items = cart.items.all()
        total = sum(item.product.price * item.quantity for item in cart_items)

        # Serialize cart items
        cart_items_data = [
            {
                'product': item.product.name,
                'quantity': item.quantity,
                'price': item.product.price,
                'total_price': item.product.price * item.quantity
            }
            for item in cart_items
        ]
        
        return Response({
            'cart_items': cart_items_data,
            'total': total
        })

class AddToCartView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        
        # Get product and cart, handle exceptions if they do not exist
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product.owner == user:
            return Response({'message': 'You cannot add your own product to the cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Use atomic transaction to ensure the operations are done atomically
        with transaction.atomic():
            # Get or create the cart for the user
            cart, created = Cart.objects.get_or_create(user=user)

            # Try to get an existing CartItem, if it does not exist, create a new one
            cart_item, created = CartItem.objects.get_or_create(product=product, cart=cart)
            if not created:
                # If the item already exists, increase its quantity
                cart_item.quantity += 1
                cart_item.save()

        return Response({'message': 'Product added to cart successfully'}, status=status.HTTP_200_OK)
class CreateOrderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get all items in the cart
        cart_items = cart.items.all()
        if not cart_items:
            return Response({'message':'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in cart_items)
        with transaction.atomic():
            order = Order.objects.create(user=user, total_price=total)
            order.items.set(cart_items.all())
            order.save()

            cart.items.all().delete()

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user)