import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          api.get(`/courses/${id}/`),
          api.get(`/courses/assignments/?course_id=${id}`),
        ]);
        setCourse(cRes.data);
        setAssignments(aRes.data);
        if (user.role === 'student') {
          const enrRes = await api.get('/courses/my-enrollments/');
          const myEnr = enrRes.data.find(e => e.course === parseInt(id));
          setEnrollment(myEnr);
        }
      } catch(e) { console.error(e); }
    };
    fetchData();
  }, [id, user.role]);

  const updateProgress = async (progress) => {
    if (!enrollment) return;
    try {
      await api.post(`/courses/progress/${enrollment.id}/`, { progress });
      setEnrollment({...enrollment, progress});
      if (progress >= 100) {
        await api.post('/certificates/issue/', { enrollment_id: enrollment.id });
        alert('🏆 Congratulations! Certificate issued!');
      }
    } catch(e) { alert('Error updating progress'); }
  };

  if (!course) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1 className="page-title">{course.title}</h1>
      <p style={{color:'var(--text2)', marginBottom:24}}>👨‍🏫 {course.instructor_name} • ⏱ {course.duration_weeks} weeks • ₹{course.price}</p>

      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:24}}>
        <div>
          <div className="card" style={{marginBottom:20}}>
            <h2 style={{marginBottom:12, fontSize:'1.1rem'}}>📋 About this Course</h2>
            <p style={{color:'var(--text2)', lineHeight:1.7}}>{course.description}</p>
          </div>

          {assignments.length > 0 && (
            <div className="card">
              <h2 style={{marginBottom:16, fontSize:'1.1rem'}}>📝 Assignments</h2>
              {assignments.map(a => (
                <div key={a.id} style={{padding:'14px 0', borderBottom:'1px solid var(--border)'}}>
                  <div className="flex justify-between">
                    <strong>{a.title}</strong>
                    <span className="badge badge-warning">Due: {new Date(a.due_date).toLocaleDateString()}</span>
                  </div>
                  <p style={{color:'var(--text2)', fontSize:'0.85rem', marginTop:6}}>{a.description}</p>
                  <span style={{fontSize:'0.8rem', color:'var(--text2)'}}>Max marks: {a.max_marks}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {enrollment && (
            <div className="card">
              <h2 style={{marginBottom:16, fontSize:'1.1rem'}}>📈 Your Progress</h2>
              <div className="progress-bar" style={{marginBottom:12}}>
                <div className="progress-fill" style={{width:`${enrollment.progress}%`}}></div>
              </div>
              <p style={{textAlign:'center', marginBottom:16, fontWeight:600}}>{enrollment.progress}% Complete</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                {[25, 50, 75, 100].map(p => (
                  <button key={p} className={`btn btn-sm ${enrollment.progress >= p ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => updateProgress(p)}>{p}%</button>
                ))}
              </div>
              <span className={`badge badge-${enrollment.status === 'completed' ? 'success' : 'info'}`} style={{marginTop:12, display:'block', textAlign:'center'}}>
                {enrollment.status}
              </span>
            </div>
          )}

          <div className="card" style={{marginTop:16}}>
            <h2 style={{marginBottom:12, fontSize:'1.1rem'}}>📊 Course Stats</h2>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              <div className="flex justify-between"><span style={{color:'var(--text2)'}}>Students</span><strong>{course.enrollment_count}</strong></div>
              <div className="flex justify-between"><span style={{color:'var(--text2)'}}>Duration</span><strong>{course.duration_weeks} weeks</strong></div>
              <div className="flex justify-between"><span style={{color:'var(--text2)'}}>Price</span><strong>₹{course.price}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
