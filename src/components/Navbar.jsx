import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('userType') || 'citizen';
  const userName = localStorage.getItem('userName') || (userType === 'admin' ? 'Admin' : userType === 'driver' ? 'Jean Claude' : 'Nadine');

  const pageTitle = location.pathname.split('/').filter(Boolean).slice(-1)[0] || 'dashboard';
  const title = pageTitle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const logout = () => {
    ['token', 'userId', 'userType', 'userName', 'userEmail', 'driverId'].forEach((key) => localStorage.removeItem(key));
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <div className="mobile-brand">♻ <strong>SMART WASTE</strong></div>
        <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{title}</strong></div>
        <h1>Welcome back, {userName.split(' ')[0]} 👋</h1>
        <p>Here’s what’s happening in your system today.</p>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" onClick={() => navigate(`/${userType}/notifications`)} aria-label="Notifications">
          ◉<span className="notification-dot">3</span>
        </button>
        <div className="profile-wrap">
          <button className="profile-button" onClick={() => setOpen(!open)}>
            <span className="avatar">{userName.slice(0, 1).toUpperCase()}</span>
            <span className="profile-copy"><strong>{userName}</strong><small>{userType === 'admin' ? 'Super Admin' : userType}</small></span>
            <span>⌄</span>
          </button>
          {open && (
            <div className="profile-menu">
              <button onClick={() => navigate(`/${userType}/dashboard`)}>Dashboard</button>
              <button onClick={() => navigate(`/${userType}/feedback`)}>Feedback</button>
              <button className="danger" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
