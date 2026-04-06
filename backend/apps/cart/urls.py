from django.urls import path
from .import views

urlpatterns = [
    path("add/<int:product_id>/", views.add_to_cart, name="add_to_cart"),
    path("", views.view_cart, name="view_cart"),
    path("items/<int:item_id>/quantity/", views.update_cart_item_quantity, name="update_cart_item_quantity"),
    path("items/<int:item_id>/", views.remove_cart_item, name="remove_cart_item"),
    path("clear/", views.clear_cart, name="clear_cart"),
]
