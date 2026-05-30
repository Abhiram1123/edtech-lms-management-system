import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses:0, enrollments:0, payments:0, certificates:0 });
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courses, payments, certs] = await Promise.all([
          api.get('/courses/'),
          api.get('/payments/'),
          api.get('/certificates/my/'),
        ]);
        let enr = [];
        if (user.role === 'student') {
          const res = await api.get('/courses/my-enrollments/');
          enr = res.data; setEnrollments(enr);
        } else {
          const res = await api.get('/courses/all-enrollments/');
          enr = res.data;
        }
        setStats({
          courses: courses.data.length,
          enrollments: enr.length,
          payments: payments.data.length,
          certificates: certs.data.length,
        });
      } catch(e) { console.error(e); }
    };
    fetchData();
  }, [user.role]);

  const statCards = [
    { label: 'Total Courses', value: stats.courses, icon: '📚', color: '#6c63ff' },
    { label: user.role === 'student' ? 'My Enrollments' : 'Total Enrollments', value: stats.enrollments, icon: '🎓', color: '#00d4ff' },
    { label: 'Payments', value: stats.payments, icon: '💳', color: '#00c896' },
    { label: 'Certificates', value: stats.certificates, icon: '🏆', color: '#ffb347' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, {user.first_name || user.username}! 👋</h1>
      <p className="page-subtitle">Here's what's happening on your LMS platform</p>

      <div className="stats-grid">
        {statCards.map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{fontSize:'2rem', marginBottom:8}}>{s.icon}</div>
            <div className="stat-value" style={{color: s.color}}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {user.role === 'student' && enrollments.length > 0 && (
        <div className="card">
          <h2 style={{marginBottom:20, fontSize:'1.2rem'}}>📈 My Course Progress</h2>
          {enrollments.map(e => (
            <div key={e.id} style={{marginBottom:20}}>
              <div className="flex justify-between items-center mb-2">
                <span style={{fontWeight:600}}>{e.course_title}</span>
                <span style={{color:'var(--text2)', fontSize:'0.85rem'}}>{e.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${e.progress}%`}}></div>
              </div>
              <div style={{marginTop:6}}>
                <span className={`badge badge-${e.status === 'completed' ? 'success' : e.status === 'active' ? 'info' : 'danger'}`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {user.role !== 'student' && (
        <div className="card" style={{marginTop:24}}>
          <h2 style={{marginBottom:16, fontSize:'1.2rem'}}>🚀 Quick Actions</h2>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <a href="/courses" className="btn btn-primary">➕ Add Course</a>
            <a href="/classes" className="btn btn-outline">📅 Schedule Class</a>
            <a href="/payments" className="btn btn-outline">💰 View Payments</a>
            <a href="/students" className="btn btn-outline">👥 Manage Students</a>
          </div>
        </div>
      )}
    </div>
  );
}
