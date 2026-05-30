import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/classes/').then(r => setClasses(r.data)).catch(console.error);
    api.get('/users/list/?role=student').then(r => setStudents(r.data)).catch(console.error);
  }, []);

  const toggleStudent = (id) => {
    setSelected(prev => ({...prev, [id]: !prev[id]}));
  };

  const submitAttendance = async () => {
    if (!selectedClass) return alert('Select a class!');
    const presentIds = Object.keys(selected).filter(id => selected[id]);
    try {
      await api.post(`/classes/${selectedClass}/attendance/`, { student_ids: presentIds });
      alert('✅ Attendance marked successfully!');
    } catch { alert('Error marking attendance'); }
  };

  return (
    <div className="page">
      <h1 className="page-title">📋 Smart Attendance</h1>
      <p className="page-subtitle">Mark and track student attendance</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:24}}>
        <div className="card">
          <h3 style={{marginBottom:16}}>Select Class</h3>
          {classes.map(c => (
            <div key={c.id} onClick={() => setSelectedClass(c.id)}
              style={{
                padding:'12px', borderRadius:10, marginBottom:8, cursor:'pointer',
                background: selectedClass === c.id ? 'var(--accent)' : 'var(--surface2)',
                border: '1px solid var(--border)'
              }}>
              <div style={{fontWeight:600, fontSize:'0.9rem'}}>{c.title}</div>
              <div style={{fontSize:'0.8rem', color: selectedClass===c.id ? 'white' : 'var(--text2)'}}>
                {c.course_title}
              </div>
            </div>
          ))}
          {classes.length === 0 && <p style={{color:'var(--text2)'}}>No classes yet</p>}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3>Mark Attendance</h3>
            <div>
              <span style={{color:'var(--success)', marginRight:16}}>
                ✅ Present: {Object.values(selected).filter(Boolean).length}
              </span>
              <span style={{color:'var(--danger)'}}>
                ❌ Absent: {students.length - Object.values(selected).filter(Boolean).length}
              </span>
            </div>
          </div>

          {students.map(s => (
            <div key={s.id} onClick={() => toggleStudent(s.id.toString())}
              style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'12px', borderRadius:10, marginBottom:8,
                background: selected[s.id] ? 'rgba(0,200,150,0.1)' : 'var(--surface2)',
                border: `1px solid ${selected[s.id] ? 'var(--success)' : 'var(--border)'}`,
                cursor:'pointer'
              }}>
              <div style={{
                width:36, height:36, borderRadius:'50%',
                background: selected[s.id] ? 'var(--success)' : 'var(--surface)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:700
              }}>
                {selected[s.id] ? '✅' : (s.first_name?.[0] || '?')}
              </div>
              <div>
                <div style={{fontWeight:600}}>{s.first_name} {s.last_name}</div>
                <div style={{fontSize:'0.8rem', color:'var(--text2)'}}>@{s.username}</div>
              </div>
              <div style={{marginLeft:'auto'}}>
                <span className={`badge badge-${selected[s.id] ? 'success' : 'danger'}`}>
                  {selected[s.id] ? 'Present' : 'Absent'}
                </span>
              </div>
            </div>
          ))}

          {user.role !== 'student' && (
            <button className="btn btn-success" style={{marginTop:16, width:'100%'}}
              onClick={submitAttendance}>
              ✅ Submit Attendance
            </button>
          )}
        </div>
      </div>
    </div>
  );
}