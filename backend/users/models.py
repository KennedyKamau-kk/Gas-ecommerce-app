# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True, null=True)
    is_customer = models.BooleanField(default=True)

    def __str__(self):
        return self.username

# Model for password reset tokens
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        """Check if token is still valid (not used and not expired)"""
        return not self.is_used and self.expires_at > timezone.now()

    def __str__(self):
        return f"Reset token for {self.user.email} - Valid: {self.is_valid()}"
