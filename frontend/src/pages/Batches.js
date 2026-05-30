import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', course:'', start_date:'', end_date:'' });
  const { user } = useAuth();

  useEffect(() => {
    api.get('/batches/').then(r => setBatches(r.data)).catch(console.error);
    api.get('/courses/').then(r => setCourses(r.data)).catch(console.error);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/batches/', form);
      setShowModal(false);
      const r = await api.get('/batches/');
      setBatches(r.data);
    } catch(e) { alert('Error creating batch'); }
  };

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">📦 Batch Management</h1>
          <p className="page-subtitle">{batches.length} batches total</p>
        </div>
        {user.role !== 'student' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Create Batch</button>
        )}
      </div>

      <div className="card-grid">
        {batches.map(batch => (
          <div key={batch.id} className="card">
            <div style={{fontSize:'2rem', marginBottom:8}}>📦</div>
            <h3 style={{fontSize:'1.1rem', fontWeight:600, marginBottom:8}}>{batch.name}</h3>
            <p className="text-muted">📅 Start: {new Date(batch.start_date).toLocaleDateString()}</p>
            <p className="text-muted">📅 End: {new Date(batch.end_date).toLocaleDateString()}</p>
          </div>
        ))}
        {batches.length === 0 && (
          <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text2)', padding:60}}>
            No batches yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">➕ Create New Batch</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Batch Name</label>
                <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select className="form-select" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} required>
                  <option value="">Select course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-input" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} required />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" type="submit">Create Batch</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}