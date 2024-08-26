from django.db import models
from django.contrib.auth.models import  AbstractUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re

def validate_password(value: str) -> None:
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    
    patterns = [
        (r'[A-Z]', "Password must contain at least one uppercase letter."),
        (r'[a-z]', "Password must contain at least one lowercase letter."),
        (r'\d', "Password must contain at least one number."),
        (r'[@$!%*#?&]', "Password must contain at least one special character (@$!%*#?&)."),
    ]
    
    for pattern, error_message in patterns:
        if not re.search(pattern, value):
            raise ValidationError(error_message)
# User db model
class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    role_id = models.ForeignKey('Roles', on_delete=models.CASCADE, blank=True, null=True)
    display_name = models.CharField(
        max_length=50, 
        unique=False, 
        blank=True, 
        null=True, 
        help_text="Optional. A name displayed to other users instead of the username."
    )
    email = models.EmailField(unique=True)
    password = models.CharField(
        max_length=150,
        validators=[validate_password],
        unique=False
    )
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
class Roles(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        verbose_name = _("Role")
        verbose_name_plural = _("Roles")

    def __str__(self):
        return f"{self.user.username} - {self.role}"
# Message db model
class Message(models.Model):
    sender = models.ForeignKey(
        CustomUser, 
        related_name='sent_messages', 
        on_delete=models.CASCADE, 
        db_index=True
    )
    receiver = models.ForeignKey(
        CustomUser, 
        related_name='received_messages', 
        on_delete=models.CASCADE, 
        db_index=True
    )
    message = models.TextField()
    file = models.FileField(upload_to='files/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-timestamp']
        verbose_name = _("Message")
        verbose_name_plural = _("Messages")

    def __str__(self):
        return f'Message from {self.sender} to {self.receiver} at {self.timestamp}'
    
    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError(_("Sender and receiver cannot be the same user."))
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
# Product db model
class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100,default="General")
    description = models.TextField(max_length=500,default="description")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(CustomUser, related_name='products', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
# Variant db model
class Variant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} of {self.product.name}"
# Cart db model
class Cart(models.Model):
    user = models.ForeignKey(CustomUser, related_name='carts', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"
# CartItem db model
class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product')
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart.user.username}'s cart"
# Order db model
class Order(models.Model):
    user = models.ForeignKey(CustomUser, related_name='orders', on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=100, default='Pending')
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Order of {self.user.username} for {self.total_price}"
# ProductReview db model
class ProductReview(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    review = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review of {self.product.name} by {self.user.username}"