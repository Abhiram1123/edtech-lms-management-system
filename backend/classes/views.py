from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers
from .models import OnlineClass, Attendance

class OnlineClassSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()

    class Meta:
        model = OnlineClass
        fields = '__all__'

    def get_course_title(self, obj):
        return obj.course.title

    def get_instructor_name(self, obj):
        return f"{obj.instructor.first_name} {obj.instructor.last_name}"

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = '__all__'

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

class OnlineClassListCreateView(generics.ListCreateAPIView):
    serializer_class = OnlineClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return OnlineClass.objects.filter(course_id=course_id).order_by('-scheduled_at')
        return OnlineClass.objects.all().order_by('-scheduled_at')

class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, class_id):
        from django.utils import timezone
        try:
            online_class = OnlineClass.objects.get(id=class_id)
            student_ids = request.data.get('student_ids', [])
            for sid in student_ids:
                from users.models import CustomUser
                student = CustomUser.objects.get(id=sid)
                Attendance.objects.update_or_create(
                    online_class=online_class,
                    student=student,
                    defaults={'is_present': True, 'joined_at': timezone.now()}
                )
            return Response({'message': f'Attendance marked for {len(student_ids)} students'})
        except OnlineClass.DoesNotExist:
            return Response({'error': 'Class not found'}, status=404)

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        class_id = self.request.query_params.get('class_id')
        if class_id:
            return Attendance.objects.filter(online_class_id=class_id)
        return Attendance.objects.filter(student=self.request.user)
