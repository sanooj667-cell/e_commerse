from decimal import Decimal

from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price", max_digits=10, decimal_places=2, read_only=True
    )
    product_stock = serializers.IntegerField(source="product.stock", read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_price",
            "product_stock",
            "quantity",
            "line_total",
            "created_at",
        ]

    def get_line_total(self, obj):
        return (obj.product.price or Decimal("0.00")) * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "created_at", "items", "total_quantity", "total_price"]

    def get_total_quantity(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        total = Decimal("0.00")
        for item in obj.items.select_related("product").all():
            total += (item.product.price or Decimal("0.00")) * item.quantity
        return total


class UpdateCartItemQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
