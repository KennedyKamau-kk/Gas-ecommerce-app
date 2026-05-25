from django.urls import path
from products import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListCreateView.as_view(), name='categories'),
]

