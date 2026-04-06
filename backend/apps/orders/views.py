from decimal import Decimal

from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.categories.models import Product

from .models import Order, OrderItem
from .serializers import (
    CheckoutSummarySerializer,
    OrderSerializer,
    PlaceOrderSerializer,
    UpdatePaymentSerializer,
)


def _get_checkout_summary(cart):
    cart_items = list(cart.items.select_related("product").all())
    total_quantity = sum(item.quantity for item in cart_items)
    total_price = sum((item.product.price or Decimal("0.00")) * item.quantity for item in cart_items)
    return cart_items, total_quantity, total_price


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = (
            Cart.objects.filter(user=request.user)
            .prefetch_related("items__product")
            .first()
        )
        if not cart or not cart.items.exists():
            return Response({"message": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items, total_quantity, total_price = _get_checkout_summary(cart)
        serializer = CheckoutSummarySerializer(
            {
                "items": cart_items,
                "total_quantity": total_quantity,
                "total_price": total_price,
            }
        )
        return Response(serializer.data)


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        input_serializer = PlaceOrderSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        cart = (
            Cart.objects.filter(user=request.user)
            .prefetch_related("items__product")
            .first()
        )
        if not cart or not cart.items.exists():
            return Response({"error": "Cannot place order with an empty cart."}, status=status.HTTP_400_BAD_REQUEST)

        cart_items, _, total_price = _get_checkout_summary(cart)
        for item in cart_items:
            if item.quantity > item.product.stock:
                return Response(
                    {
                        "error": f"Insufficient stock for {item.product.name}.",
                        "available_stock": item.product.stock,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user=request.user,
                    total_price=total_price,
                    shipping_address=input_serializer.validated_data.get("shipping_address", ""),
                    phone_number=input_serializer.validated_data.get("phone_number", ""),
                    payment_method=input_serializer.validated_data.get("payment_method", "COD"),
                    status="PENDING",
                    payment_status="PENDING",
                )

                order_items = []
                for item in cart_items:
                    stock_updated = Product.objects.filter(
                        id=item.product_id,
                        stock__gte=item.quantity,
                    ).update(stock=F("stock") - item.quantity)
                    if stock_updated == 0:
                        raise ValueError(f"Insufficient stock for {item.product.name}.")

                    order_items.append(
                        OrderItem(
                            order=order,
                            product=item.product,
                            quantity=item.quantity,
                            price=item.product.price,
                        )
                    )

                OrderItem.objects.bulk_create(order_items)
                cart.items.all().delete()

        except ValueError as error:
            return Response({"error": str(error)}, status=status.HTTP_409_CONFLICT)

        return Response(
            {
                "message": "Order placed successfully.",
                "order": OrderSerializer(order).data,
            },
            status=status.HTTP_201_CREATED,
        )


class UpdatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = UpdatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment_status = serializer.validated_data["payment_status"]
        payment_reference = serializer.validated_data.get("payment_reference", "")

        order.payment_status = payment_status
        if payment_reference:
            order.payment_reference = payment_reference

        if payment_status == "PAID":
            order.status = "PAID"
            order.paid_at = timezone.now()
        elif payment_status == "FAILED":
            order.status = "CANCELLED"
            order.paid_at = None

        order.save()
        return Response(
            {
                "message": "Payment status updated.",
                "order": OrderSerializer(order).data,
            }
        )


class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items__product")
        return Response(OrderSerializer(orders, many=True).data)
