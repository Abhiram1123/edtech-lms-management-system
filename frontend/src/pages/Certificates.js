import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const endpoint = user.role === 'student' ? '/certificates/my/' : '/certificates/all/';
    api.get(endpoint).then(r => { setCerts(r.data); setLoading(false); }).catch(console.error);
  }, [user.role]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1 className="page-title">🏆 Certificates</h1>
      <p className="page-subtitle">{user.role === 'student' ? 'Your earned certificates' : 'All issued certificates'}</p>

      {certs.length === 0 ? (
        <div className="card" style={{textAlign:'center', padding:60}}>
          <div style={{fontSize:'4rem', marginBottom:16}}>🏆</div>
          <h3 style={{marginBottom:8}}>No certificates yet</h3>
          <p style={{color:'var(--text2)'}}>Complete a course to earn your certificate!</p>
        </div>
      ) : (
        <div className="card-grid">
          {certs.map(cert => (
            <div key={cert.id} className="card" style={{
              background:'linear-gradient(135deg, #1a1a28, #12121a)',
              border:'1px solid #FFD700aa', textAlign:'center', padding:32
            }}>
              <div style={{fontSize:'3rem', marginBottom:12}}>🏆</div>
              <div style={{color:'#FFD700', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.1em', marginBottom:8}}>
                CERTIFICATE OF COMPLETION
              </div>
              <h3 style={{fontSize:'1.2rem', marginBottom:6}}>{cert.student_name}</h3>
              <p style={{color:'var(--text2)', marginBottom:4, fontSize:'0.9rem'}}>completed</p>
              <h4 style={{color:'var(--accent2)', marginBottom:16}}>{cert.course_title}</h4>
              <div style={{padding:'8px 16px', background:'rgba(255,215,0,0.1)', borderRadius:8, marginBottom:12}}>
                <code style={{color:'#FFD700', fontSize:'0.8rem'}}>ID: {cert.certificate_id}</code>
              </div>
              <p className="text-muted" style={{fontSize:'0.8rem'}}>
                Issued: {new Date(cert.issued_date).toLocaleDateString()}
              </p>
              {cert.pdf_file && (
                <a href={`http://localhost:8000/media/certificates/cert_${cert.certificate_id}.pdf`} target="_blank" rel="noreferrer"
                  className="btn btn-warning btn-sm" style={{marginTop:12, textDecoration:'none'}}>
                  📄 Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
