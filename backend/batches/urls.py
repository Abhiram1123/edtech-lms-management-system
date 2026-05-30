from django.urls import path
from . import views

urlpatterns = [
    path('', views.BatchListCreateView.as_view()),
    path('<int:pk>/', views.BatchDetailView.as_view()),
]