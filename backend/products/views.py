from django.shortcuts import render
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        # Core resources
        'products': reverse('product-list', request=request, format=format),
        'categories': reverse('categories', request=request, format=format),
        'cart': reverse('cart-list', request=request, format=format),

        # Order related
        'orders': reverse('order-list', request=request, format=format),
        'checkout': reverse('checkout', request=request, format=format),

        # User related
        'register': reverse('register', request=request, format=format),
        'login': reverse('login', request=request, format=format),
        'profile': reverse('profile', request=request, format=format),
    })


# GET all products and POST new product
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}


# GET single product, PUT and DELETE
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}


# Categories
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

