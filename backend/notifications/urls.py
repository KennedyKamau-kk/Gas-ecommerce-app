from django.urls import path
from notifications import views

urlpatterns = [
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
]