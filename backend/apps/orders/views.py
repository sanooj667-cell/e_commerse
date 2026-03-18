from django.shortcuts import render
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.cart.models import Cart, CartItem
from .serializers import CheckoutSerializer

# Create your views here.

class ChekoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items  = CartItem.objects.filter(user = request.user).select_related('product')

        if not cart_items.exists():
            return Response({"message": "Your cart is empty."}, status=400)
        
        total_price = sum(item.product.price * item.quantity for item in cart_items)
        
        serializer = CheckoutSerializer({
            "total_price": total_price,
            "items": cart_items
        })

        return Response(serializer.data)
