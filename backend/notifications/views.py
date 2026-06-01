from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer


# GET all notifications for logged in user
class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


# Handle single notification
class NotificationDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(
            {"message": "Notification marked as read"},
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.delete()
        return Response(
            {"message": "Notification deleted successfully"},
            status=status.HTTP_200_OK
        )
    
