from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.CreateMessageView.as_view(), name='create_message'),
    path('messages/list/', views.MessageListView.as_view(), name='list_message'),
    path('messages/delete/<int:pk>/', views.MessageDeleteView.as_view(), name='delete_message'),
    path('products/', views.CreateProductView.as_view(), name='create_product'),
    path('products/delete/<int:pk>/', views.DeleteProductView.as_view(), name='delete_product'),
    path('products/list/', views.ProductListView.as_view(), name='list_product'),
    path('products/list/all/', views.AllProductListView.as_view(), name='list_all_product'),
]
