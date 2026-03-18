from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Category,Product
from .serializers import CategorySerializer,ProductSerializer


@api_view(["GET", "POST"])
def categories(request):

    if request.method == "GET":

        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        if not request.user.is_staff_user:
            return Response(
                {"error": "Only admin can create categories"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
@api_view(["GET", "PUT", "DELETE"])
def category_detail(request, pk):

    try:
        category = Category.objects.get(id=pk)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)
    

    if request.method == "GET":
        serilizer = CategorySerializer(category)
        return Response(serilizer.data)
    

    
    if request.method == "POST":
        if not request.user.is_staff_user:
            return Response({"error": "Only admin can update category"}, status=status.HTTP_403_FORBIDDEN)
        
        serilizer = CategorySerializer(category, data= request.data)

        if serilizer.is_valid():
            serilizer.save()
            return Response(serilizer.data)
        
        return Response(serilizer.errors)
    

    if request.method == "DELETE":
        if not request.user.is_staff_user:
            return Response({"error":"Only admin can delete category"}, status=status.HTTP_403_FORBIDDEN)

        category.delete()

        return Response({"error":"category deleted successfully"})
    

@api_view(["GET", "POST"])
def Products(request):
    if request.method == "GET":
        Products = Product.objects.all()
        context = {"request": request}
        serializer = ProductSerializer(Products, many=True, context=context)
        return Response(serializer.data)

    if request.method == "POST":
        if not request.user.is_staff_user:
            return Response({"error": "Only admin can create products"}, status=status.HTTP_403_FORBIDDEN)
        context = {"request": request}
        serializer = ProductSerializer(data=request.data, context=context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

        
@api_view(["GET", "PUT"])
def edit_product(request, pk):
    try:
        products = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    

    serilizer = ProductSerializer(products, data=request.data)
    if serilizer.is_valid():
        serilizer.save()
        return Response(serilizer.data)
    return Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
@api_view(["DELETE"])
def delete_product(request,pk):
    try:
        products = Product.objects.get(id=pk)

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    
    if not request.user.is_staff_user:
        return Response({"error": "Only admin can delete products"}, status=status.HTTP_403_FORBIDDEN)

    products.delete()
    return Response({"message": "Product deleted successfully"})


