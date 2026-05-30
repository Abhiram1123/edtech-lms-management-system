from django.urls import path
from . import views

urlpatterns = [
    path('', views.OnlineClassListCreateView.as_view()),
    path('<int:class_id>/attendance/', views.MarkAttendanceView.as_view()),
    path('attendance/', views.AttendanceListView.as_view()),
]
