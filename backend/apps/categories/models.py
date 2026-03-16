from django.db import models


class Category(models.Model):

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "categories"
        ordering = ["-id"]

    def __str__(self):
        return self.name
    
    
    
class Product(models.Model):

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="product_images/", blank=True, null=True)
    stock = models.IntegerField(default=0)

    class Meta:
        db_table = "products"
        ordering = ["-id"]

    def __str__(self):
        return self.name
