from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer
from products.models import Product

class CartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Authenticated user
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart, context={'request': request})
            return Response(serializer.data)
        
        # Guest user
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        cart, created = Cart.objects.get_or_create(
            session_key=session_key,
            user=None
        )
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class AddToCartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)

        if serializer.is_valid():
            product_id = serializer.validated_data["product_id"]
            quantity = serializer.validated_data["quantity"]

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

            # Authenticated user
            if request.user.is_authenticated:
                cart, created = Cart.objects.get_or_create(user=request.user)
            else:
                # Guest user
                session_key = request.session.session_key
                if not session_key:
                    request.session.create()
                    session_key = request.session.session_key
                
                cart, created = Cart.objects.get_or_create(
                    session_key=session_key,
                    user=None
                )

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product
            )

            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity

            cart_item.save()
            
            return Response({
                "message": "Item added to cart",
                "cart_id": cart.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCartItemView(APIView):
    permission_classes = [AllowAny]

    def get_cart_item(self, pk, request):
        if request.user.is_authenticated:
            return CartItem.objects.filter(id=pk, cart__user=request.user).first()
        else:
            session_key = request.session.session_key
            if not session_key:
                return None
            return CartItem.objects.filter(id=pk, cart__session_key=session_key, cart__user=None).first()

    def patch(self, request, pk):
        cart_item = self.get_cart_item(pk, request)
        
        if not cart_item:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response({"error": "Quantity required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if int(quantity) <= 0:
            cart_item.delete()
            return Response({"message": "Item removed"}, status=status.HTTP_200_OK)
        
        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Cart updated"}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        cart_item = self.get_cart_item(pk, request)
        
        if not cart_item:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    
        cart_item.delete()
        return Response({"message": "Item removed successfully"}, status=status.HTTP_200_OK)
    

class IncreaseCartItemView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # stock safety
        if cart_item.quantity >= cart_item.product.stock:
            return Response(
                {"error": "Not enough stock"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity += 1
        cart_item.save()

        return Response({"message": "Quantity increased"})


class DecreaseCartItemView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(
                id=pk,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # if quantity becomes 0 -> delete item
        if cart_item.quantity <= 1:
            cart_item.delete()
            return Response({"message": "Item removed"})

        cart_item.quantity -= 1
        cart_item.save()

        return Response({"message": "Quantity decreased"})

