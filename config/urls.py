from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

def health_check(request):
    return JsonResponse({
        "status": "ok",
        "service": "e-commerce-api",
        "environment": "production"
    })

urlpatterns = [
    path('health/', health_check),
    path('admin/', admin.site.urls),
]