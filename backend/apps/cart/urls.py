from django.urls import include, path
from .import views

urlpatterns = [
    path('add/<int:product_id>/', views.Add_to_Cart, name='add_to_cart'),
    path("", views.View_Cart, name="view_cart"),
]