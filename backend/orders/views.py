from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer
from payments.mpesa_service import stk_push


class CheckoutView(APIView):

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)

        if serializer.is_valid():
            phone_number = serializer.validated_data["phone_number"]

            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({"error": "Cart not found"}, status=404)

            cart_items = cart.items.all()

            if not cart_items.exists():
                return Response({"error": "Cart is empty"}, status=400)

            # Wrap the entire checkout process in a transaction
            with transaction.atomic():
                total_amount = 0
                order = Order.objects.create(
                    user=request.user,
                    total_amount=0
                )

                for item in cart_items:
                    price = item.product.price
                    quantity = item.quantity

                    # check stock
                    if item.product.stock < quantity:
                        return Response(
                            {"error": f"{item.product.name} is out of stock"},
                            status=400
                        )

                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=quantity,
                        price=price
                    )

                    total_amount += price * quantity

                    # reduce stock
                    item.product.stock -= quantity
                    item.product.save()

                order.total_amount = total_amount
                order.save()

                # Trigger M-Pesa STK Push
                stk_response = stk_push(
                    phone_number=phone_number,
                    amount=int(total_amount),
                    order_id=order.id
                )

                checkout_request_id = stk_response.get("CheckoutRequestID")

                if checkout_request_id:
                    order.checkout_request_id = checkout_request_id
                    order.save()

                # clear cart
                cart_items.delete()

                return Response({
                    "message": "Order created successfully. Check your phone for M-Pesa prompt.",
                    "order_id": order.id,
                    "total_amount": total_amount,
                    "mpesa_response": stk_response
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Returns all orders for the logged-in user
class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
    

# Returns one specific order. User cannot view another user's orders
class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    