from rest_framework import serializers
from .models import Payment, FeeReminder

class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = '__all__'

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_course_title(self, obj):
        return obj.course.title

class FeeReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeReminder
        fields = '__all__'
