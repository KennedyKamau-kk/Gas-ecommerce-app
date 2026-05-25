from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order
from .models import Payment, MpesaCallbackLog
from .mpesa_service import verify_transaction


class MpesaCallbackView(APIView):

    def post(self, request):
        try:
            # Log the raw callback first
            MpesaCallbackLog.objects.create(payload=request.data)

            data = request.data
            callback = data.get("Body", {}).get("stkCallback", {})
            result_code = callback.get("ResultCode")
            checkout_request_id = callback.get("CheckoutRequestID")

            # Find order using CheckoutRequestID
            try:
                order = Order.objects.get(
                    checkout_request_id=checkout_request_id
                )
            except Order.DoesNotExist:
                return Response({"error": "Order not found"}, status=404)

            # Payment failed
            if result_code != 0:
                order.status = "failed"
                order.save()

                return Response({"message": "Payment failed"})

            # Verify transaction with Safaricom
            verification = verify_transaction(checkout_request_id)

            if verification.get("ResultCode") != "0":
                return Response({"error": "Transaction verification failed"})

            # Extract payment metadata
            metadata_items = callback.get("CallbackMetadata", {}).get("Item", [])
            metadata = {item["Name"]: item.get("Value") for item in metadata_items}
            amount = metadata.get("Amount")
            mpesa_receipt = metadata.get("MpesaReceiptNumber")
            phone = metadata.get("PhoneNumber")

            # Prevent duplicate payments
            if not Payment.objects.filter(transaction_id=mpesa_receipt).exists():
                Payment.objects.create(
                    order=order,
                    transaction_id=mpesa_receipt,
                    phone_number=phone,
                    amount=amount,
                    status="success"
                )

                order.status = "paid"
                order.save()

            return Response({"message": "Callback processed successfully"})

        except Exception as e:
            print("Callback Error:", e)
            return Response({"error": "Something went wrong"}, status=500)
        
        