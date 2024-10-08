from django.shortcuts import render
from rest_framework import generics,status
from .serializers import UserSerializer, MessageSerializer,ProductSerializer, LoginSerializer, CustomTokenObtainPairSerializer, OrderSerializer, ProductImageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Message , Product, CustomUser, Cart, CartItem, Order, Variant, ProductImage
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

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


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

class EditProductVariantView(generics.UpdateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ProductImage.objects.filter(variant__product__owner=user)

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(owner=user)

class AllProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.order_by('?')
    permission_classes = [AllowAny]
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
        total = sum(item.variant_product.price * item.quantity for item in cart_items)

        # Serialize cart items
        cart_items_data = [
            {
                'id': item.variant_product.product.id,
                'product': item.variant_product.product.name,
                'variant': item.variant_product.name,
                'image' : item.variant_product.images.first().image.url,
                'quantity': item.quantity,
                'price': item.variant_product.price,
                'total_price': item.variant_product .price * item.quantity
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
        quantity = int(request.query_params.get('quantity', 1))

        # Get product and cart, handle exceptions if they do not exist
        try:
            product = Variant.objects.get(pk=pk)
        except Variant.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock <= 0:
            return Response({'message': 'Product out of stock'}, status=status.HTTP_400_BAD_REQUEST)

        if product.product.owner == user:
            return Response({'message': 'You cannot add your own product to the cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Use atomic transaction to ensure the operations are done atomically
        with transaction.atomic():
            # Get or create the cart for the user
            cart, created = Cart.objects.get_or_create(user=user)

            # Try to get an existing CartItem, if it does not exist, create a new one
            cart_item, created = CartItem.objects.get_or_create(variant_product=product, cart=cart)
            if not created:
                # If the item already exists, increase its quantity
                cart_item.quantity += quantity
                product.stock -= quantity
                product.save()
                cart_item.save()
            else:
                cart_item.quantity = quantity
                product.stock -= quantity
                product.save()
                cart_item.save()

        return Response({'message': 'Product added to cart successfully'}, status=status.HTTP_200_OK)
class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        quantity = int(request.query_params.get('quantity', 1))

        # Get product and cart, handle exceptions if they do not exist
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product.owner == user:
            return Response({'message': 'You cannot remove your own product from the cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Use atomic transaction to ensure the operations are done atomically
        with transaction.atomic():
            # Get the cart for the user
            try:
                cart = Cart.objects.get(user=user)
            except Cart.DoesNotExist:
                return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

            # Try to get an existing CartItem, if it does not exist, return an error
            try:
                cart_item = CartItem.objects.get(product=product, cart=cart)
            except CartItem.DoesNotExist:
                return Response({'message': 'Product not found in cart'}, status=status.HTTP_404_NOT_FOUND)

            # If the item exists, decrease its quantity
            if cart_item.quantity > quantity:
                cart_item.quantity -= quantity
                cart_item.save()
            else:
                cart_item.delete()

        return Response({'message': 'Product removed from cart successfully'}, status=status.HTTP_200_OK)

class CreateOrderView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_item_ids = request.data.get('cart_item_ids', [])

        if not cart_item_ids:
            return Response({'message': 'No cart items selected'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get selected items in the cart
        cart_items = CartItem.objects.filter(product__id__in=cart_item_ids, cart=cart)
        if not cart_items.exists():
            return Response({'message': 'Selected cart items not found'}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.product.price * item.quantity for item in cart_items)
        with transaction.atomic():
            order = Order.objects.create(user=user, total_price=total)
            order.items.set(cart_items)
            order.save()

            # Remove selected items from the cart
            cart_items.delete()

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user)
