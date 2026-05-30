from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Course, Enrollment, Assignment, Submission
from .serializers import CourseSerializer, EnrollmentSerializer, AssignmentSerializer, SubmissionSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            enrollment, created = Enrollment.objects.get_or_create(
                student=request.user, course=course
            )
            if created:
                return Response({'message': 'Enrolled successfully'}, status=201)
            return Response({'message': 'Already enrolled'}, status=200)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)

class AssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Assignment.objects.filter(course_id=course_id)
        return Assignment.objects.all()

class SubmissionView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, enrollment_id):
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id, student=request.user)
            progress = request.data.get('progress', 0)
            enrollment.progress = progress
            if progress >= 100:
                enrollment.status = 'completed'
            enrollment.save()
            return Response({'message': 'Progress updated', 'progress': progress})
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=404)

class AllEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Enrollment.objects.all()
