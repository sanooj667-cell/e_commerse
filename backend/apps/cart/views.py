from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.categories.models import Product
from .models import Cart, CartItem
from .serializers import CartItemSerializer

# Create your views here.

@api_view(["POST"])
def Add_to_Cart(request, product_id):
    user = request.user
    quntity = int(request.data.get("quantity", 1))
    product = Product.objects.get(id=product_id)

    cart, created = Cart.objects.get_or_create(user=user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += quntity
    
    cart_item.save()
    return Response({"message": f"Added {quntity} x {product.name} to cart."})

@api_view(["GET"])
def View_Cart(request):
    try:
        cart = Cart.objects.get(user=request.user)
        items = CartItem.objects.filter(cart=cart)
    except Cart.DoesNotExist:
        return Response([])

    data = []
    for item in items:
        data.append({
            "product": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "total": item.product.price * item.quantity
        })
    return Response(data)
