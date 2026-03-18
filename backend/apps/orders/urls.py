from django.urls import path
from .views import ChekoutView

urlpatterns = [
    path("checkout/", ChekoutView.as_view(), name="checkout"),
]