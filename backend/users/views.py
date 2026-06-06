# users/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .serializers import RegisterSerializer, ProfileSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .models import PasswordResetToken
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.
class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number,
            "address": user.address,
            "is_customer": user.is_customer
        })
    
    def put(self, request):
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def patch(self, request):
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# Views for password reset
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email__iexact=email)
            
            # Delete any existing unused tokens for this user
            PasswordResetToken.objects.filter(user=user, is_used=False).delete()
            
            # Create new token (expires in 24 hours)
            token = PasswordResetToken.objects.create(
                user=user,
                expires_at=timezone.now() + timedelta(hours=24)
            )
            
            # Generate reset link (update with your frontend URL)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_link = f"{frontend_url}/reset-password/{token.token}"
            
            # Send email
            try:
                send_mail(
                    subject="Password Reset Request - Your App Name",
                    message=f"""Hello {user.username},

                    You requested to reset your password for your account.

                    Click the link below to reset your password (valid for 24 hours):
                    {reset_link}

                    If you didn't request this, please ignore this email.

                    Best regards,
                    Gas Market""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False,
                )
                
                return Response(
                    {"message": "Password reset link has been sent to your email address."},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                # Delete the token if email fails
                token.delete()
                return Response(
                    {"error": "Failed to send reset email. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateResetTokenView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """Check if token is valid before showing reset form"""
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            
            if reset_token.is_valid():
                return Response({
                    "valid": True,
                    "email": reset_token.user.email,
                    "message": "Token is valid"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "valid": False,
                    "message": "Token has expired or has been used"
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except PasswordResetToken.DoesNotExist:
            return Response({
                "valid": False,
                "message": "Invalid token"
            }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        # Verify token exists
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired reset link. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if token is valid
        if not reset_token.is_valid():
            return Response(
                {"error": "This reset link has expired. Please request a new password reset."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate and reset password
        serializer = ResetPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user = reset_token.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Mark token as used
            reset_token.is_used = True
            reset_token.save()
            
            # Delete all other unused tokens for this user
            PasswordResetToken.objects.filter(user=user, is_used=False).delete()
            
            return Response(
                {"message": "Password has been reset successfully. You can now login with your new password."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
