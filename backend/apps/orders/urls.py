from django.urls import path
from .views import CheckoutView, OrderHistoryView, PlaceOrderView, UpdatePaymentView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("place/", PlaceOrderView.as_view(), name="place_order"),
    path("<int:order_id>/pay/", UpdatePaymentView.as_view(), name="update_payment"),
    path("", OrderHistoryView.as_view(), name="order_history"),
]
