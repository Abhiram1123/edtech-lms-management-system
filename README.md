# ⚡ EdTech LMS — Learning Management System

A full-stack EdTech LMS platform built with **Django REST Framework** + **React**.

## 🚀 Features
- 🔐 **Multi-role Auth** — Admin, Faculty, Student (JWT)
- 📚 **Course Management** — Create, enroll, track courses
- 💳 **Payment System** — Fee collection with transaction tracking
- 🎥 **Online Classes** — Schedule & manage live sessions
- 📈 **Progress Tracking** — Real-time course completion tracking
- 🏆 **Auto Certificates** — PDF certificate on course completion
- 👥 **Student Management** — Directory with search

---

## 🛠️ Setup Instructions

### ✅ Prerequisites
- Python 3.10+
- Node.js 18+
- Git

---

### 🔧 Backend Setup (Django)

```bash
# 1. Go to backend folder
cd edtech-lms/backend

# 2. Create virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py makemigrations users courses payments certificates classes
python manage.py migrate

# 5. Create superuser (admin)
python manage.py createsuperuser

# 6. Start backend server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

### 🎨 Frontend Setup (React)

```bash
# Open a new terminal
cd edtech-lms/frontend

# Install packages
npm install

# Start frontend
npm start
```

Frontend runs at: **http://localhost:3000**

---

### 👤 Create Demo Users (optional)

In Django shell: `python manage.py shell`

```python
from users.models import CustomUser

# Faculty
CustomUser.objects.create_user(
    username='faculty1', password='pass123',
    first_name='Priya', last_name='Sharma',
    role='faculty', email='priya@lms.com'
)

# Student
CustomUser.objects.create_user(
    username='student1', password='pass123',
    first_name='Rahul', last_name='Kumar',
    role='student', email='rahul@lms.com'
)
```

---

## 📁 Project Structure

```
edtech-lms/
├── backend/
│   ├── users/          # Auth & user management
│   ├── courses/        # Course, enrollment, assignments
│   ├── payments/       # Fee collection & reminders
│   ├── certificates/   # PDF certificate generation
│   ├── classes/        # Online class scheduling
│   ├── settings.py
│   ├── urls.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/      # Dashboard, Courses, Payments, etc.
        ├── components/ # Navbar
        ├── context/    # Auth context
        └── utils/      # API helper
```

---

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/register/` | POST | Register user |
| `/api/users/login/` | POST | Login & get JWT token |
| `/api/courses/` | GET/POST | List/Create courses |
| `/api/courses/<id>/enroll/` | POST | Enroll in course |
| `/api/payments/create/` | POST | Process payment |
| `/api/classes/` | GET/POST | List/Schedule classes |
| `/api/certificates/issue/` | POST | Issue certificate |

---

## 🏆 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 + DRF |
| Auth | JWT (SimpleJWT) |
| Frontend | React 18 |
| HTTP | Axios |
| Routing | React Router v6 |
| PDF | ReportLab |
| DB | SQLite (dev) / PostgreSQL (prod) |

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - EdTech LMS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/edtech-lms.git
git push -u origin main
```
