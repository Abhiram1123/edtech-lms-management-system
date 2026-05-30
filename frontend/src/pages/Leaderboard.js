import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Leaderboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/users/list/?role=student').then(r => {
      const withPoints = r.data.map((s, i) => ({
        ...s,
        points: Math.floor(Math.random() * 1000) + 100,
        badge: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '⭐',
        level: i < 3 ? 'Gold' : i < 6 ? 'Silver' : 'Bronze'
      })).sort((a,b) => b.points - a.points);
      setStudents(withPoints);
    }).catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">🏆 Leaderboard</h1>
      <p className="page-subtitle">Top performing students</p>

      <div className="card">
        {students.slice(0,3).length > 0 && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24}}>
            {students.slice(0,3).map((s,i) => (
              <div key={s.id} style={{
                textAlign:'center', padding:20,
                background: i===0 ? 'rgba(255,215,0,0.1)' : i===1 ? 'rgba(192,192,192,0.1)' : 'rgba(205,127,50,0.1)',
                borderRadius:16, border: `1px solid ${i===0?'#FFD700':i===1?'#C0C0C0':'#CD7F32'}`
              }}>
                <div style={{fontSize:'2.5rem'}}>{s.badge}</div>
                <div style={{fontWeight:700, marginTop:8}}>{s.first_name} {s.last_name}</div>
                <div style={{color:'var(--accent)', fontWeight:700}}>{s.points} pts</div>
                <div className={`badge badge-${i===0?'warning':i===1?'info':'success'}`} style={{marginTop:6}}>
                  {s.level}
                </div>
              </div>
            ))}
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Points</th>
              <th>Badge</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s,i) => (
              <tr key={s.id}>
                <td><strong>#{i+1}</strong></td>
                <td>{s.first_name} {s.last_name}</td>
                <td style={{color:'var(--accent)', fontWeight:600}}>{s.points} pts</td>
                <td style={{fontSize:'1.2rem'}}>{s.badge}</td>
                <td><span className="badge badge-info">{s.level}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}