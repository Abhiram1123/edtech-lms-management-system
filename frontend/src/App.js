import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Payments from './pages/Payments';
import Classes from './pages/Classes';
import Certificates from './pages/Certificates';
import Notifications from './pages/notifications';
import Batches from './pages/Batches';
import Students from './pages/Students';
import Navbar from './components/Navbar';
import AIAssistant from './pages/AIAssistant';
import Leaderboard from './pages/Leaderboard';
import Attendance from './pages/Attendance';
import Performance from './pages/Performance';
import ContentGenerator from './pages/ContentGenerator';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <PrivateRoute>
                <Navbar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/classes" element={<Classes />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/batches" element={<Batches />} />
                    <Route path="/ai-assistant" element={<AIAssistant />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/content-generator" element={<ContentGenerator />} />
                    
                  </Routes>
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
