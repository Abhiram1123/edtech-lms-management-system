import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/', label: '📊 Dashboard', roles: ['admin','faculty','student'] },
    { to: '/courses', label: '📚 Courses', roles: ['admin','faculty','student'] },
    { to: '/classes', label: '🎥 Classes', roles: ['admin','faculty','student'] },
    { to: '/payments', label: '💳 Payments', roles: ['admin','faculty','student'] },
    { to: '/certificates', label: '🏆 Certificates', roles: ['admin','faculty','student'] },
    { to: '/notifications', label: '🔔 Notifications', roles: ['admin','faculty','student'] },
    { to: '/batches', label: '📦 Batches', roles: ['admin','faculty'] },
    { to: '/students', label: '👥 Students', roles: ['admin','faculty'] },
    { to: '/ai-assistant', label: '🤖 AI Assistant', roles: ['admin','faculty','student'] },
    { to: '/leaderboard', label: '🏆 Leaderboard', roles: ['admin','faculty','student'] },
    { to: '/attendance', label: '📋 Attendance', roles: ['admin','faculty','student'] },
{ to: '/performance', label: '📊 Performance', roles: ['student'] },
{ to: '/content-generator', label: '✨ AI Content', roles: ['admin','faculty'] },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">⚡ EdTech LMS</div>
      <div className="nav-links">
        {links
          .filter(l => l.roles.includes(user?.role))
          .map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({isActive}) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
      </div>
      <div className="nav-user">
        <span className="role-badge">{user?.role}</span>
        <span>{user?.first_name || user?.username}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
