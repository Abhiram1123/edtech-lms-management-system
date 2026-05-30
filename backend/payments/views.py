from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
import uuid
from .models import Payment, FeeReminder
from .serializers import PaymentSerializer, FeeReminderSerializer
from courses.models import Course, Enrollment

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'faculty']:
            return Payment.objects.all().order_by('-created_at')
        return Payment.objects.filter(student=user).order_by('-created_at')

class CreatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_id = request.data.get('course_id')
        payment_method = request.data.get('payment_method', 'online')
        try:
            course = Course.objects.get(id=course_id)
            payment = Payment.objects.create(
                student=request.user,
                course=course,
                amount=course.price,
                status='paid',
                transaction_id=str(uuid.uuid4())[:12].upper(),
                payment_method=payment_method,
                paid_at=timezone.now()
            )
            Enrollment.objects.get_or_create(student=request.user, course=course)
            return Response(PaymentSerializer(payment).data, status=201)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

class SendReminderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student_id = request.data.get('student_id')
        course_id = request.data.get('course_id')
        message = request.data.get('message', 'Please complete your fee payment.')
        from users.models import CustomUser
        try:
            student = CustomUser.objects.get(id=student_id)
            course = Course.objects.get(id=course_id)
            reminder = FeeReminder.objects.create(student=student, course=course, message=message)
            return Response({'message': 'Reminder sent successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class MyRemindersView(generics.ListAPIView):
    serializer_class = FeeReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FeeReminder.objects.filter(student=self.request.user, is_read=False)
