import requests
import base64
import datetime
from django.conf import settings


# Generate Access Token
def get_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    url = f"{settings.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

    try:
        response = requests.get(url, auth=(consumer_key, consumer_secret))
        response.raise_for_status()
        return response.json().get("access_token")

    except requests.exceptions.RequestException as e:
        print("Access Token Error:", e)
        return None


# STK Push Function
def stk_push(phone_number, amount, order_id):
    access_token = get_access_token()

    if not access_token:
        return {"error": "Failed to get access token"}

    url = f"{settings.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(
        (settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp).encode()
    ).decode()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": f"{order_id}",
        "TransactionDesc": "Gas Purchase"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        return response.json()

    except requests.exceptions.RequestException as e:
        print("STK Push Error:", e)
        return {"error": "STK push failed"}


# Verify Transaction (STK Query)
def verify_transaction(checkout_request_id):
    access_token = get_access_token()

    if not access_token:
        return {"error": "Access token failed"}

    url = f"{settings.MPESA_BASE_URL}/mpesa/stkpushquery/v1/query"
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(
        (settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp).encode()
    ).decode()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        return response.json()

    except requests.exceptions.RequestException as e:
        print("Verification Error:", e)
        return {"error": "Verification failed"}
    
    