import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Performance() {
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/courses/my-enrollments/').then(r => setEnrollments(r.data)).catch(console.error);
    api.get('/payments/').then(r => setPayments(r.data)).catch(console.error);
  }, []);

  const avgProgress = enrollments.length ?
    Math.round(enrollments.reduce((sum,e) => sum + e.progress, 0) / enrollments.length) : 0;

  const completed = enrollments.filter(e => e.status === 'completed').length;
  const points = completed * 100 + avgProgress * 2;

  return (
    <div className="page">
      <h1 className="page-title">📊 My Performance</h1>
      <p className="page-subtitle">Track your learning journey</p>

      <div className="stats-grid" style={{marginBottom:24}}>
        <div className="stat-card">
          <div style={{fontSize:'2rem'}}>📚</div>
          <div className="stat-value">{enrollments.length}</div>
          <div className="stat-label">Courses Enrolled</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize:'2rem'}}>✅</div>
          <div className="stat-value" style={{color:'var(--success)'}}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize:'2rem'}}>📈</div>
          <div className="stat-value" style={{color:'var(--accent2)'}}>{avgProgress}%</div>
          <div className="stat-label">Avg Progress</div>
        </div>
        <div className="stat-card">
          <div style={{fontSize:'2rem'}}>⭐</div>
          <div className="stat-value" style={{color:'var(--warning)'}}>{points}</div>
          <div className="stat-label">Total Points</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:24}}>
        <h2 style={{marginBottom:20, fontSize:'1.1rem'}}>📈 Course Progress</h2>
        {enrollments.map(e => (
          <div key={e.id} style={{marginBottom:20}}>
            <div className="flex justify-between items-center mb-2">
              <span style={{fontWeight:600}}>{e.course_title}</span>
              <span style={{color:'var(--text2)'}}>{e.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width:`${e.progress}%`}}></div>
            </div>
            <div style={{marginTop:6, display:'flex', justifyContent:'space-between'}}>
              <span className={`badge badge-${e.status==='completed'?'success':'info'}`}>{e.status}</span>
              <span style={{fontSize:'0.8rem', color:'var(--text2)'}}>
                {e.progress >= 100 ? '🏆 Completed!' : e.progress >= 50 ? '💪 Halfway there!' : '🚀 Keep going!'}
              </span>
            </div>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p style={{color:'var(--text2)', textAlign:'center', padding:30}}>No courses enrolled yet!</p>
        )}
      </div>

      <div className="card">
        <h2 style={{marginBottom:16, fontSize:'1.1rem'}}>🎯 Achievements</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:12}}>
          {[
            { icon:'🚀', title:'First Login', earned: true },
            { icon:'📚', title:'Course Enrolled', earned: enrollments.length > 0 },
            { icon:'💳', title:'Fee Paid', earned: payments.length > 0 },
            { icon:'🏆', title:'Course Completed', earned: completed > 0 },
            { icon:'⭐', title:'High Scorer', earned: points > 500 },
            { icon:'🎓', title:'Graduate', earned: completed >= 2 },
          ].map((a,i) => (
            <div key={i} style={{
              textAlign:'center', padding:16, borderRadius:12,
              background: a.earned ? 'rgba(108,99,255,0.1)' : 'var(--surface2)',
              border: `1px solid ${a.earned ? 'var(--accent)' : 'var(--border)'}`,
              opacity: a.earned ? 1 : 0.5
            }}>
              <div style={{fontSize:'2rem'}}>{a.icon}</div>
              <div style={{fontSize:'0.8rem', marginTop:6, fontWeight:600}}>{a.title}</div>
              {a.earned && <div style={{color:'var(--success)', fontSize:'0.75rem'}}>✅ Earned!</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}