import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', price:'', duration_weeks:4 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/');
      setCourses(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses/', { ...form, instructor: user.id });
      setShowModal(false);
      setForm({ title:'', description:'', price:'', duration_weeks:4 });
      fetchCourses();
    } catch(e) { alert('Error creating course'); }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll/`);
      alert('Enrolled successfully!');
    } catch(e) { alert('Error enrolling'); }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">📚 Courses</h1>
          <p className="page-subtitle">{courses.length} courses available</p>
        </div>
        {(user.role === 'admin' || user.role === 'faculty') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Create Course</button>
        )}
      </div>

      <div className="card-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div style={{height:120, background:`linear-gradient(135deg, #6c63ff22, #00d4ff22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem'}}>
              📖
            </div>
            <div className="course-card-body">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-meta">👨‍🏫 {course.instructor_name} • ⏱ {course.duration_weeks} weeks • 👥 {course.enrollment_count} enrolled</p>
              <p style={{color:'var(--text2)', fontSize:'0.85rem', marginBottom:12, lineHeight:1.5}}>
                {course.description?.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="course-price">₹{course.price}</span>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/courses/${course.id}`)}>View</button>
                  {user.role === 'student' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(course.id)}>Enroll</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Course</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (weeks)</label>
                  <input type="number" className="form-input" value={form.duration_weeks} onChange={e=>setForm({...form,duration_weeks:e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2" style={{marginTop:8}}>
                <button className="btn btn-primary" type="submit">Create Course</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
