from decimal import Decimal

from rest_framework import serializers

from apps.cart.models import CartItem

from .models import Order, OrderItem


class CheckoutItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    unit_price = serializers.DecimalField(
        source="product.price", max_digits=10, decimal_places=2, read_only=True
    )
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product_id", "product_name", "unit_price", "quantity", "line_total"]

    def get_line_total(self, obj):
        return (obj.product.price or Decimal("0.00")) * obj.quantity


class CheckoutSummarySerializer(serializers.Serializer):
    items = CheckoutItemSerializer(many=True)
    total_quantity = serializers.IntegerField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class PlaceOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=20)
    payment_method = serializers.ChoiceField(
        choices=[choice[0] for choice in Order.PAYMENT_METHOD_CHOICES],
        required=False,
        default="COD",
    )


class UpdatePaymentSerializer(serializers.Serializer):
    payment_status = serializers.ChoiceField(
        choices=[choice[0] for choice in Order.PAYMENT_STATUS_CHOICES]
    )
    payment_reference = serializers.CharField(required=False, allow_blank=True, max_length=120)


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product_id", "product_name", "price", "quantity", "line_total"]

    def get_line_total(self, obj):
        return (obj.price or Decimal("0.00")) * obj.quantity


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "payment_status",
            "payment_method",
            "payment_reference",
            "total_price",
            "shipping_address",
            "phone_number",
            "paid_at",
            "created_at",
            "items",
        ]
