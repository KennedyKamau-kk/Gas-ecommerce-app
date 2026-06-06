# users/urls.py
from django.urls import path
from users import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("forgot-password/", views.ForgotPasswordView.as_view(), name="forgot-password"),
    path("validate-token/<uuid:token>/", views.ValidateResetTokenView.as_view(), name="validate-token"),
    path("reset-password/<uuid:token>/", views.ResetPasswordView.as_view(), name="reset-password"),
]