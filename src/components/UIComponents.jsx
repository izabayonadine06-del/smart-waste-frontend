import React from 'react';
import '../styles/components.css';

// Stat Card Component - Display key metrics
export const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  subtitle = '',
  trend = null,
  onClick = null 
}) => {
  return (
    <div 
      className={`stat-card stat-${color}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-icon">
        <span className={`icon icon-${icon}`}>📊</span>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {trend && (
          <p className={`stat-trend ${trend.type}`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, size = 'medium' }) => {
  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      assigned: 'info',
      in_progress: 'primary',
      completed: 'success',
      collected: 'success',
      cancelled: 'danger',
      available: 'success',
      on_duty: 'primary',
      on_break: 'warning',
      offline: 'secondary',
      accepted: 'success',
      rejected: 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <span className={`status-badge status-${getStatusColor(status)} size-${size}`}>
      {getStatusLabel(status)}
    </span>
  );
};

// Waste Report Card Component
export const WasteReportCard = ({ 
  report, 
  onAction = null, 
  actionLabel = 'View Details',
  showMap = false 
}) => {
  return (
    <div className="waste-report-card">
      <div className="report-header">
        <div className="report-category">
          <span className="category-icon">🗑️</span>
          <span className="category-name">{report.category}</span>
        </div>
        <StatusBadge status={report.status} size="small" />
      </div>
      
      <div className="report-body">
        <h4 className="report-title">{report.title}</h4>
        <p className="report-description">{report.description}</p>
        
        <div className="report-meta">
          <div className="meta-item">
            <span className="meta-label">📍 Location:</span>
            <span className="meta-value">{report.address}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">⚠️ Priority:</span>
            <span className={`priority-${report.priority}`}>{report.priority.toUpperCase()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">📅 Reported:</span>
            <span className="meta-value">{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {report.imageUrl && (
          <div className="report-image">
            <img src={report.imageUrl} alt="Waste" />
          </div>
        )}
      </div>

      <div className="report-footer">
        <button 
          className="btn btn-primary"
          onClick={() => onAction && onAction(report.id)}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

// Collection Card Component
export const CollectionCard = ({ collection, onAction = null }) => {
  return (
    <div className="collection-card">
      <div className="collection-header">
        <div className="collection-info">
          <h4>Collection #{collection.id}</h4>
          <p className="collection-date">
            {new Date(collection.assignedAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={collection.status} />
      </div>

      <div className="collection-body">
        <div className="collection-row">
          <span className="label">📋 Report ID:</span>
          <span className="value">{collection.reportId}</span>
        </div>
        <div className="collection-row">
          <span className="label">👤 Driver:</span>
          <span className="value">{collection.driverName}</span>
        </div>
        <div className="collection-row">
          <span className="label">⏰ Scheduled:</span>
          <span className="value">
            {collection.pickupTime ? new Date(collection.pickupTime).toLocaleTimeString() : 'Not scheduled'}
          </span>
        </div>
        <div className="collection-row">
          <span className="label">⚖️ Weight:</span>
          <span className="value">{collection.actualWeight || 'Pending'} kg</span>
        </div>
      </div>

      {onAction && (
        <div className="collection-footer">
          <button className="btn btn-sm btn-primary" onClick={() => onAction(collection.id)}>
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

// Simple Bar Chart Component
export const BarChart = ({ data, title, xlabel, ylabel }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="bar-chart">
        {data.map((item, idx) => (
          <div key={idx} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-wrapper">
              <div 
                className="bar" 
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component
export const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="pie-chart-wrapper">
        <svg viewBox="0 0 200 200" className="pie-chart">
          {data.map((item, idx) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = sliceAngle > 180 ? 1 : 0;
            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
            
            currentAngle = endAngle;
            
            return (
              <path 
                key={idx} 
                d={path} 
                fill={colors[idx % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'][idx % 6] }}></span>
              <span className="legend-label">{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Notification Panel Component
export const NotificationPanel = ({ notifications, onDismiss }) => {
  return (
    <div className="notification-panel">
      <h4 className="notification-title">Notifications</h4>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No new notifications</p>
        ) : (
          notifications.map((notif, idx) => (
            <div 
              key={idx} 
              className={`notification-item notification-${notif.type}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <button 
                className="notification-close"
                onClick={() => onDismiss && onDismiss(notif.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Simple Map Component (Placeholder - use real maps library in production)
export const MapComponent = ({ latitude, longitude, title = 'Location' }) => {
  return (
    <div className="map-container">
      <div className="map-placeholder">
        <div className="map-content">
          <p>📍 {title}</p>
          <p className="map-coordinates">
            Lat: {latitude?.toFixed(4)}, Lng: {longitude?.toFixed(4)}
          </p>
          <p className="map-note">
            (Integration with Google Maps or Leaflet recommended for production)
          </p>
        </div>
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({ isOpen, title, children, onClose, footer = null }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

// Alert Component
export const Alert = ({ type = 'info', title = '', message = '', onClose = null }) => {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {title && <h5>{title}</h5>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
};
