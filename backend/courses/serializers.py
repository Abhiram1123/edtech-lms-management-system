from rest_framework import serializers
from .models import Course, Module, Lesson, Enrollment, Assignment, Submission
from users.serializers import UserSerializer

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    modules = ModuleSerializer(many=True, read_only=True)
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_instructor_name(self, obj):
        return f"{obj.instructor.first_name} {obj.instructor.last_name}"

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    def get_course_title(self, obj):
        return obj.course.title

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'
