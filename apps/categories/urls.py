from django.urls import include, path
from .import views

urlpatterns = [
    path('', views.categories, name='category'),
    path('category_detail/<int:pk>/', views.category_detail, name='category_detail'),
    path('products/', views.products, name='products'),
    path('edit_product/<int:pk>/', views.edit_product, name='edit_product'),
    path('delete_product/<int:pk>/', views.delete_product, name='delete_product'),
] 