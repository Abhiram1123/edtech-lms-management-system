from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import FileResponse
import uuid, os
from .models import Certificate
from .serializers import CertificateSerializer
from courses.models import Enrollment

def generate_certificate_pdf(certificate):
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import landscape, A4
        from reportlab.lib import colors
        from django.conf import settings

        filename = f"cert_{certificate.certificate_id}.pdf"
        filepath = os.path.join(settings.MEDIA_ROOT, 'certificates', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        c = canvas.Canvas(filepath, pagesize=landscape(A4))
        width, height = landscape(A4)

        # Background
        c.setFillColor(colors.HexColor('#1a1a2e'))
        c.rect(0, 0, width, height, fill=1)

        # Border
        c.setStrokeColor(colors.HexColor('#FFD700'))
        c.setLineWidth(5)
        c.rect(20, 20, width-40, height-40, fill=0)

        # Title
        c.setFillColor(colors.HexColor('#FFD700'))
        c.setFont("Helvetica-Bold", 40)
        c.drawCentredString(width/2, height-100, "CERTIFICATE OF COMPLETION")

        # Subtitle
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 20)
        c.drawCentredString(width/2, height-150, "This is to certify that")

        # Student Name
        c.setFillColor(colors.HexColor('#FFD700'))
        c.setFont("Helvetica-Bold", 35)
        student_name = f"{certificate.student.first_name} {certificate.student.last_name}"
        c.drawCentredString(width/2, height-210, student_name)

        # Course
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 18)
        c.drawCentredString(width/2, height-260, "has successfully completed the course")

        c.setFillColor(colors.HexColor('#00D4FF'))
        c.setFont("Helvetica-Bold", 25)
        c.drawCentredString(width/2, height-310, certificate.course.title)

        # Date and ID
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width/2, height-380, f"Date: {certificate.issued_date.strftime('%B %d, %Y')}")
        c.drawCentredString(width/2, height-410, f"Certificate ID: {certificate.certificate_id}")

        # EdTech LMS
        c.setFillColor(colors.HexColor('#FFD700'))
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width/2, 60, "EdTech LMS Platform")

        c.save()
        return f"certificates/{filename}"
    except Exception as e:
        print(f"PDF Error: {e}")
        return None

class IssueCertificateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        enrollment_id = request.data.get('enrollment_id')
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id)
            if enrollment.progress < 100:
                return Response({'error': 'Course not completed yet'}, status=400)
            cert, created = Certificate.objects.get_or_create(
                student=enrollment.student,
                course=enrollment.course,
                defaults={'certificate_id': str(uuid.uuid4())[:10].upper()}
            )
            if created:
                pdf_path = generate_certificate_pdf(cert)
                if pdf_path:
                    cert.pdf_file = pdf_path
                    cert.save()
            return Response(CertificateSerializer(cert).data, status=201 if created else 200)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=404)

class MyCertificatesView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(student=self.request.user)

class AllCertificatesView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Certificate.objects.all()
