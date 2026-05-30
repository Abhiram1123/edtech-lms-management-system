from django.db import models
from users.models import CustomUser
from courses.models import Course

class OnlineClass(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    title = models.CharField(max_length=200)
    instructor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    meeting_link = models.URLField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    recording_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Attendance(models.Model):
    online_class = models.ForeignKey(OnlineClass, on_delete=models.CASCADE, related_name='attendance')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_present = models.BooleanField(default=False)
    joined_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['online_class', 'student']
