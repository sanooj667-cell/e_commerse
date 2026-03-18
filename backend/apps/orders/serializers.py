from rest_framework import serializers
from .models import Order, OrderItem

from rest_framework import serializers
from .models import Order, OrderItem

class CheckoutitemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'product_name', 'product_price']


class CheckoutSerializer(serializers.ModelSerializer):
    items = CheckoutitemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'status', 'created_at', 'items']