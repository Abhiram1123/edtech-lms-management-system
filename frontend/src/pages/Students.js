import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/list/?role=student').then(r => { setStudents(r.data); setLoading(false); }).catch(console.error);
  }, []);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.username} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading students...</div>;

  return (
    <div className="page">
      <h1 className="page-title">👥 Students</h1>
      <p className="page-subtitle">{students.length} registered students</p>

      <div style={{marginBottom:20}}>
        <input className="form-input" placeholder="🔍 Search students..." value={search}
          onChange={e => setSearch(e.target.value)} style={{maxWidth:400}} />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <div style={{
                      width:36, height:36, borderRadius:'50%', background:'var(--accent)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:700, fontSize:'0.9rem', flexShrink:0
                    }}>
                      {(s.first_name?.[0] || s.username[0]).toUpperCase()}
                    </div>
                    <strong>{s.first_name} {s.last_name}</strong>
                  </div>
                </td>
                <td className="text-muted">@{s.username}</td>
                <td>{s.email}</td>
                <td className="text-muted">{s.phone || '—'}</td>
                <td><span className="badge badge-info">{s.role}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center', color:'var(--text2)', padding:40}}>No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
