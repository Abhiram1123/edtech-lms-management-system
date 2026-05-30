import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{textAlign:'center', marginBottom:24}}>
          <div style={{fontSize:'3rem'}}>⚡</div>
          <h1 className="auth-title">EdTech LMS</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn btn-primary" style={{width:'100%', marginTop:8}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{textAlign:'center', marginTop:20, color:'var(--text2)'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--accent)'}}>Register</Link>
        </p>

        <div style={{marginTop:24, padding:16, background:'var(--surface2)', borderRadius:12, fontSize:'0.8rem', color:'var(--text2)'}}>
          <strong style={{color:'var(--text)'}}>Demo accounts (after setup):</strong><br/>
          Admin: admin / admin123<br/>
          Faculty: faculty1 / pass123<br/>
          Student: student1 / pass123
        </div>
      </div>
    </div>
  );
}
