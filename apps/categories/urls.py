from django.urls import include, path
from .import views

urlpatterns = [
    path('', views.categories, name='category'),
    path('category_detail/<int:pk>/', views.category_detail, name='category_detail'),
] 