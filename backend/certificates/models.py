from django.db import models
from users.models import CustomUser
from courses.models import Course

class Certificate(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    issued_date = models.DateField(auto_now_add=True)
    certificate_id = models.CharField(max_length=20, unique=True)
    pdf_file = models.FileField(upload_to='certificates/', blank=True, null=True)

    class Meta:
        unique_together = ['student', 'course']

    def __str__(self):
        return f"Certificate - {self.student.username} - {self.course.title}"
