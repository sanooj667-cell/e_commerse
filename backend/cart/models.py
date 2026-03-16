from django.db import models
from apps.categories.models import Product

# Create your models here.

class Cart(models.Model):

    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="carts")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "carts"
        ordering = ["-id"]

    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"
    

    
    

class CartItem(models.Model):

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cart_items"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"
