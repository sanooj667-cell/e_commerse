from django.contrib import admin

from apps.categories.models import Category, Product

# Register your models here

admin.site.register(Category)
admin.site.register(Product)
