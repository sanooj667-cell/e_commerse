from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

def home(request):
    return JsonResponse({
        "status": "success",
        "message": "Backend is running 🚀"
    })

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
]