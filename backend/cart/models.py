from django.db import models
from django.conf import settings
from products.models import Product
from django.db.models import Q

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(user__isnull=False) | 
                    Q(session_key__isnull=False)
                ),
                name="cart_has_user_or_session"
            )
        ]

    def __str__(self):
        if self.user:
            return f"Cart - {self.user.username}"
        return f"Cart - Guest ({self.session_key})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.cart.user:
            return f"CartItem - {self.product.name} (x{self.quantity}) for {self.cart.user.username}"
        return f"CartItem - {self.product.name} (x{self.quantity}) for Guest"
    
