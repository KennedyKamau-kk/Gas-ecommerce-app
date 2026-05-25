from django.urls import path
from payments import views

urlpatterns = [
    path('payments/', views.MpesaCallbackView.as_view(), name="mpesa-callback"),
]
