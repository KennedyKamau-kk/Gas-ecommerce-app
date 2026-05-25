from django.urls import path
from cart import views


urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart-list'),
    path('cart/add/', views.AddToCartView.as_view(), name='cart-add'),
    path('cart/item/<int:pk>/', views.UpdateCartItemView.as_view(), name='cart-item-update'),
    path('cart/item/<int:pk>/increase/', views.IncreaseCartItemView.as_view(), name='increase-cart-item'),
    path('cart/item/<int:pk>/decrease/', views.DecreaseCartItemView.as_view(), name='decrease-cart-item'),
]
