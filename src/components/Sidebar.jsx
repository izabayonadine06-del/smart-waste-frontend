import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const iconMap = {
  Dashboard: '⌂',
  'Report Waste': '♻',
  'My Reports': '▤',
  Collections: '▣',
  Notifications: '◉',
  Feedback: '✦',
  'My Assignments': '▣',
  Performance: '◒',
  'Waste Reports': '▤',
  Users: '♙',
  Payments: '◈',
  Analytics: '◔',
};

const Sidebar = () => {
  const location = useLocation();
  const userType = localStorage.getItem('userType') || 'citizen';
  const basePath = `/${userType}`;

  const menus = {
    citizen: [
      ['Dashboard', `${basePath}/dashboard`],
      ['Report Waste', `${basePath}/report-waste`],
      ['My Reports', `${basePath}/my-reports`],
      ['Collections', `${basePath}/collections`],
      ['Notifications', `${basePath}/notifications`],
      ['Feedback', `${basePath}/feedback`],
    ],
    driver: [
      ['Dashboard', `${basePath}/dashboard`],
      ['My Assignments', `${basePath}/collections`],
      ['Performance', `${basePath}/performance`],
      ['Notifications', `${basePath}/notifications`],
      ['Feedback', `${basePath}/feedback`],
    ],
    admin: [
      ['Dashboard', `${basePath}/dashboard`],
      ['Waste Reports', `${basePath}/waste-reports`],
      ['Collections', `${basePath}/collections`],
      ['Users', `${basePath}/users`],
      ['Payments', `${basePath}/payments`],
      ['Analytics', `${basePath}/analytics`],
      ['Feedback', `${basePath}/feedback`],
    ],
  };

  const items = menus[userType] || menus.citizen;
  const roleLabel = userType === 'admin' ? 'Administrator' : userType === 'driver' ? 'Driver' : 'Citizen';

  return (
    <aside className="app-sidebar">
      <Link className="sidebar-brand" to={`/${userType}/dashboard`}>
        <span className="brand-mark">♻</span>
        <span>
          <strong>SMART WASTE</strong>
          <small>MANAGEMENT SYSTEM</small>
        </span>
      </Link>

      <div className="sidebar-role">
        <span className="role-dot" />
        <div>
          <strong>{roleLabel}</strong>
          <small>Active account</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(([label, path]) => (
          <Link key={path} to={path} className={location.pathname === path ? 'active' : ''}>
            <span className="nav-symbol">{iconMap[label] || '•'}</span>
            <span>{label}</span>
            {label === 'Notifications' && <b className="nav-count">3</b>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-help">
        <span>♻</span>
        <div>
          <strong>Keep it green</strong>
          <small>Every report helps make Rwanda cleaner.</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
