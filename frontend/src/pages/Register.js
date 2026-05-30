import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', first_name:'', last_name:'', role:'student', phone:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/login');
    } catch(err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{maxWidth:500}}>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join EdTech LMS today</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <button className="btn btn-primary" style={{width:'100%'}} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:16, color:'var(--text2)'}}>
          Already have an account? <Link to="/login" style={{color:'var(--accent)'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}
