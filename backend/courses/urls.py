from django.urls import path
from . import views

urlpatterns = [
    path('', views.CourseListCreateView.as_view()),
    path('<int:pk>/', views.CourseDetailView.as_view()),
    path('<int:course_id>/enroll/', views.EnrollView.as_view()),
    path('my-enrollments/', views.MyEnrollmentsView.as_view()),
    path('all-enrollments/', views.AllEnrollmentsView.as_view()),
    path('assignments/', views.AssignmentListCreateView.as_view()),
    path('submit/', views.SubmissionView.as_view()),
    path('progress/<int:enrollment_id>/', views.UpdateProgressView.as_view()),
]
