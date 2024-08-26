from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.CreateMessageView.as_view(), name='create_message'),
    path('messages/list/', views.MessageListView.as_view(), name='list_message'),
    path('messages/delete/<int:pk>/', views.MessageDeleteView.as_view(), name='delete_message'),
    path('products/', views.CreateProductView.as_view(), name='create_product'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='detail_product'),
    path('products/delete/<int:pk>/', views.DeleteProductView.as_view(), name='delete_product'),
    path('products/list/', views.ProductListView.as_view(), name='list_product'),
    path('products/list/all/', views.AllProductListView.as_view(), name='list_all_product'),
    path('products/edit/<int:pk>/', views.ProductUpdateView.as_view(), name='edit_product'),
    path('cart/', views.UserCartView.as_view(), name='cart'),
    path('cart/add/<int:pk>/', views.AddToCartView.as_view(), name='add_to_cart'),
    path('cart/remove/<int:pk>/', views.RemoveFromCartView.as_view(), name='remove_from_cart'),
    path('order/', views.CreateOrderView.as_view(), name='create_order'),
    path('order/list/', views.OrderListView.as_view(), name='list_order'),
]
