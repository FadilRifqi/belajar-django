from django.db import models
from django.contrib.auth.models import  AbstractUser
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=False)
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    file = models.FileField(upload_to='files/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message
    
    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("Sender and receiver cannot be the same user.")
        
class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100,default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    owner = models.ForeignKey(CustomUser, related_name='products', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name