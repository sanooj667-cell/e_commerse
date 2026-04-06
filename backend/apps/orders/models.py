from django.db import models
from apps.categories.models import Product
from apps.users.models import User



class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]
    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("CARD", "Card"),
        ("UPI", "UPI"),
        ("NET_BANKING", "Net Banking"),
    ]
    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField(blank=True, default="")
    phone_number = models.CharField(max_length=20, blank=True, default="")
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default="COD",
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING",
    )
    payment_reference = models.CharField(max_length=120, blank=True, default="")
    paid_at = models.DateTimeField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"
        ordering = ["-id"]

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    

    

class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"{self.quantity} x {self.product.name} for Order {self.order.id}"   
    


