from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from api.views import CreateUserView,LoginView,EditUserView,DeleteUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', LoginView.as_view(), name='get_token'),
    path('api/user/edit/', EditUserView.as_view(), name='edit-user'),
    path('api/user/delete/', DeleteUserView.as_view(), name='delete-user'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
