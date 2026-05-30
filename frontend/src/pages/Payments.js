import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/payments/'),
        api.get('/courses/'),
      ]);
      setPayments(pRes.data);
      setCourses(cRes.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!selectedCourse) return;
    try {
      await api.post('/payments/create/', { course_id: selectedCourse, payment_method: 'online' });
      setShowModal(false);
      fetchData();
      alert('✅ Payment successful! You are now enrolled.');
    } catch(e) { alert('Payment failed'); }
  };

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title">💳 Payments</h1>
          <p className="page-subtitle">Fee collection & payment tracking</p>
        </div>
        {user.role === 'student' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>💰 Pay Fee</button>
        )}
      </div>

      {user.role !== 'student' && (
        <div className="stats-grid" style={{marginBottom:24}}>
          <div className="stat-card">
            <div style={{fontSize:'1.5rem'}}>💰</div>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div style={{fontSize:'1.5rem'}}>✅</div>
            <div className="stat-value">{payments.filter(p=>p.status==='paid').length}</div>
            <div className="stat-label">Paid</div>
          </div>
          <div className="stat-card">
            <div style={{fontSize:'1.5rem'}}>⏳</div>
            <div className="stat-value">{payments.filter(p=>p.status==='pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              {user.role !== 'student' && <th>Student</th>}
              <th>Course</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td><code style={{fontSize:'0.8rem', color:'var(--accent)'}}>{p.transaction_id || 'N/A'}</code></td>
                {user.role !== 'student' && <td>{p.student_name}</td>}
                <td>{p.course_title}</td>
                <td style={{fontWeight:600}}>₹{parseFloat(p.amount).toLocaleString()}</td>
                <td>{p.payment_method}</td>
                <td>
                  <span className={`badge badge-${p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center', color:'var(--text2)', padding:40}}>No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">💳 Pay Course Fee</h2>
            <div className="form-group">
              <label className="form-label">Select Course</label>
              <select className="form-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="">Choose a course...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} — ₹{c.price}</option>
                ))}
              </select>
            </div>
            {selectedCourse && (
              <div style={{padding:16, background:'var(--surface2)', borderRadius:12, marginBottom:16}}>
                <strong>Amount: </strong>₹{courses.find(c=>c.id===parseInt(selectedCourse))?.price}
              </div>
            )}
            <div className="flex gap-2">
              <button className="btn btn-success" onClick={handlePayment} disabled={!selectedCourse}>Pay Now</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
