import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course:'', title:'', scheduled_at:'', duration_minutes:60, meeting_link:'' });
  const { user } = useAuth();

  useEffect(() => {
    api.get('/classes/').then(r => setClasses(r.data)).catch(console.error);
    api.get('/courses/').then(r => setCourses(r.data)).catch(console.error);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/classes/', { ...form, instructor: user.id });
      setShowModal(false);
      const r = await api.get('/classes/');
      setClasses(r.data);
    } catch(e) { alert('Error creating class'); }
  };

  const getStatusColor = (s) => ({ scheduled:'info', live:'success', completed:'warning', cancelled:'danger' }[s] || 'info');

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">🎥 Online Classes</h1>
          <p className="page-subtitle">Schedule and manage live sessions</p>
        </div>
        {user.role !== 'student' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>📅 Schedule Class</button>
        )}
      </div>

      <div className="card-grid">
        {classes.map(cls => (
          <div key={cls.id} className="card" style={{borderLeft:`3px solid var(--accent)`}}>
            <div className="flex justify-between items-center mb-2">
              <span className={`badge badge-${getStatusColor(cls.status)}`}>{cls.status}</span>
              <span className="text-muted">{cls.duration_minutes} min</span>
            </div>
            <h3 style={{fontSize:'1.05rem', fontWeight:600, marginBottom:6}}>{cls.title}</h3>
            <p className="text-muted" style={{marginBottom:8}}>📚 {cls.course_title}</p>
            <p className="text-muted" style={{marginBottom:8}}>👨‍🏫 {cls.instructor_name}</p>
            <p style={{color:'var(--accent2)', fontSize:'0.85rem', marginBottom:12}}>
              📅 {new Date(cls.scheduled_at).toLocaleString()}
            </p>
            {cls.meeting_link && (
              <a href={cls.meeting_link} target="_blank" rel="noreferrer" className="btn btn-success btn-sm" style={{textDecoration:'none'}}>
                🔗 Join Class
              </a>
            )}
          </div>
        ))}
        {classes.length === 0 && (
          <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text2)', padding:60}}>
            No classes scheduled yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">📅 Schedule New Class</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select className="form-select" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} required>
                  <option value="">Select course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class Title</label>
                <input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Scheduled Date & Time</label>
                <input type="datetime-local" className="form-input" value={form.scheduled_at} onChange={e=>setForm({...form,scheduled_at:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input type="number" className="form-input" value={form.duration_minutes} onChange={e=>setForm({...form,duration_minutes:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Link (Zoom/Meet)</label>
                <input className="form-input" placeholder="https://..." value={form.meeting_link} onChange={e=>setForm({...form,meeting_link:e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" type="submit">Schedule</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
