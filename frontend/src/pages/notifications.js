import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications/').then(r => setNotifications(r.data)).catch(console.error);
  }, []);

  const markAllRead = async () => {
    await api.post('/notifications/read-all/');
    setNotifications(notifications.map(n => ({...n, is_read: true})));
  };

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">🔔 Notifications</h1>
          <p className="page-subtitle">{notifications.filter(n=>!n.is_read).length} unread</p>
        </div>
        <button className="btn btn-outline" onClick={markAllRead}>Mark All Read</button>
      </div>
      <div className="card">
        {notifications.length === 0 ? (
          <div style={{textAlign:'center', padding:60, color:'var(--text2)'}}>
            <div style={{fontSize:'3rem'}}>🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} style={{
            padding:'16px', borderBottom:'1px solid var(--border)',
            background: n.is_read ? 'transparent' : 'rgba(108,99,255,0.05)',
            display:'flex', gap:12, alignItems:'flex-start'
          }}>
            <div style={{fontSize:'1.5rem'}}>
              {n.type === 'payment' ? '💳' : n.type === 'class' ? '🎥' : n.type === 'success' ? '✅' : '🔔'}
            </div>
            <div>
              <strong>{n.title}</strong>
              {!n.is_read && <span className="badge badge-info" style={{marginLeft:8}}>New</span>}
              <p style={{color:'var(--text2)', fontSize:'0.85rem', marginTop:4}}>{n.message}</p>
              <p style={{color:'var(--text2)', fontSize:'0.75rem', marginTop:4}}>
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}