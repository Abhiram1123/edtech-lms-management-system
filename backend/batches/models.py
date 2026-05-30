from django.db import models
from users.models import CustomUser
from courses.models import Course

class Batch(models.Model):
    name = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='batches')
    start_date = models.DateField()
    end_date = models.DateField()
    students = models.ManyToManyField(CustomUser, blank=True, related_name='batches')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name