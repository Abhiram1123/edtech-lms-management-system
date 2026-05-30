from django.urls import path
from . import views

urlpatterns = [
    path('issue/', views.IssueCertificateView.as_view()),
    path('my/', views.MyCertificatesView.as_view()),
    path('all/', views.AllCertificatesView.as_view()),
]
