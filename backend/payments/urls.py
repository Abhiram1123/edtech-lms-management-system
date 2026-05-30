from django.urls import path
from . import views

urlpatterns = [
    path('', views.PaymentListView.as_view()),
    path('create/', views.CreatePaymentView.as_view()),
    path('reminder/', views.SendReminderView.as_view()),
    path('my-reminders/', views.MyRemindersView.as_view()),
]
