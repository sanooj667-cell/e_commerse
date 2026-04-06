from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.categories.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, UpdateCartItemQuantitySerializer


def _empty_cart_payload():
    return {
        "id": None,
        "created_at": None,
        "items": [],
        "total_quantity": 0,
        "total_price": "0.00",
    }


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id):
    try:
        quantity = int(request.data.get("quantity", 1))
    except (TypeError, ValueError):
        return Response({"error": "Quantity must be a number."}, status=status.HTTP_400_BAD_REQUEST)

    if quantity <= 0:
        return Response(
            {"error": "Quantity must be greater than zero."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product = get_object_or_404(Product, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": 0},
    )

    new_quantity = cart_item.quantity + quantity
    if new_quantity > product.stock:
        return Response(
            {
                "error": f"Only {product.stock} item(s) available in stock.",
                "available_stock": product.stock,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.quantity = new_quantity
    cart_item.save(update_fields=["quantity"])

    serializer = CartSerializer(cart)
    return Response(
        {
            "message": f"Added {quantity} x {product.name} to cart.",
            "cart": serializer.data,
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_cart(request):
    cart = (
        Cart.objects.filter(user=request.user)
        .prefetch_related("items__product")
        .first()
    )
    if not cart:
        return Response(_empty_cart_payload())

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_cart_item_quantity(request, item_id):
    cart_item = get_object_or_404(
        CartItem.objects.select_related("cart", "product"),
        id=item_id,
        cart__user=request.user,
    )

    serializer = UpdateCartItemQuantitySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    quantity = serializer.validated_data["quantity"]

    if quantity > cart_item.product.stock:
        return Response(
            {
                "error": f"Only {cart_item.product.stock} item(s) available in stock.",
                "available_stock": cart_item.product.stock,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.quantity = quantity
    cart_item.save(update_fields=["quantity"])
    return Response(
        {
            "message": "Cart item quantity updated.",
            "cart": CartSerializer(cart_item.cart).data,
        }
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    cart_item = get_object_or_404(
        CartItem.objects.select_related("cart"),
        id=item_id,
        cart__user=request.user,
    )
    cart = cart_item.cart
    cart_item.delete()

    return Response(
        {
            "message": "Item removed from cart.",
            "cart": CartSerializer(cart).data,
        }
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = Cart.objects.filter(user=request.user).first()
    if not cart:
        return Response({"message": "Cart is already empty.", "cart": _empty_cart_payload()})

    cart.items.all().delete()
    return Response(
        {
            "message": "Cart cleared successfully.",
            "cart": CartSerializer(cart).data,
        }
    )
