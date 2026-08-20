import React, { useState, useEffect } from 'react';
import { StatusBadge, Modal, Alert, LoadingSpinner } from '../components/UIComponents';
import { notificationService } from '../services/notificationService';
import '../styles/dashboard.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filterType]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '1';
      const response = await notificationService.getUserNotifications(userId);
      setNotifications(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId') || '1';
      await notificationService.markAllAsRead(userId);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading notifications..." />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      collection_update: '🚚',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notifications-page">
      <div className="dashboard-header">
        <h1>🔔 Notifications</h1>
        <p>Stay updated with system notifications</p>
      </div>

      {error && (
        <Alert
          type="danger"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="notifications-controls">
        <div className="control-left">
          <span className="unread-badge">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="control-right">
          {unreadCount > 0 && (
            <button className="btn btn-sm btn-secondary" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
          <button className="btn btn-sm btn-outline" onClick={loadNotifications}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filterType === 'info' ? 'active' : ''}`}
          onClick={() => setFilterType('info')}
        >
          Info
        </button>
        <button
          className={`filter-btn ${filterType === 'success' ? 'active' : ''}`}
          onClick={() => setFilterType('success')}
        >
          Success
        </button>
        <button
          className={`filter-btn ${filterType === 'warning' ? 'active' : ''}`}
          onClick={() => setFilterType('warning')}
        >
          Warning
        </button>
        <button
          className={`filter-btn ${filterType === 'error' ? 'active' : ''}`}
          onClick={() => setFilterType('error')}
        >
          Error
        </button>
        <button
          className={`filter-btn ${filterType === 'collection_update' ? 'active' : ''}`}
          onClick={() => setFilterType('collection_update')}
        >
          Collection Updates
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <p>📭 No notifications</p>
            <p className="empty-subtitle">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item notification-${notification.type} ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content" onClick={() => {
                setSelectedNotification(notification);
                setShowDetailModal(true);
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id);
                }
              }}>
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    className="action-btn"
                    title="Mark as read"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    ✓
                  </button>
                )}
                <button
                  className="action-btn delete"
                  title="Delete"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        title="Notification Details"
        onClose={() => setShowDetailModal(false)}
      >
        {selectedNotification && (
          <div className="notification-detail">
            <div className="detail-row">
              <label>Type:</label>
              <StatusBadge status={selectedNotification.type} />
            </div>
            <div className="detail-row">
              <label>Title:</label>
              <p>{selectedNotification.title}</p>
            </div>
            <div className="detail-row">
              <label>Message:</label>
              <p>{selectedNotification.message}</p>
            </div>
            <div className="detail-row">
              <label>Date & Time:</label>
              <p>{new Date(selectedNotification.createdAt).toLocaleString()}</p>
            </div>
            {selectedNotification.readAt && (
              <div className="detail-row">
                <label>Read At:</label>
                <p>{new Date(selectedNotification.readAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .notifications-page {
          padding: 20px;
        }

        .notifications-controls {
          background: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .control-left, .control-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .unread-badge {
          background-color: #e74c3c;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .notifications-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          background: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .filter-btn {
          padding: 8px 15px;
          border: 1px solid #ecf0f1;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          border-color: #2ecc71;
          color: #2ecc71;
        }

        .filter-btn.active {
          background: #2ecc71;
          color: white;
          border-color: #2ecc71;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid #3498db;
          display: flex;
          gap: 15px;
          align-items: center;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .notification-item:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .notification-item.unread {
          background-color: #f0f7ff;
        }

        .notification-item.notification-info {
          border-left-color: #3498db;
        }

        .notification-item.notification-success {
          border-left-color: #2ecc71;
        }

        .notification-item.notification-warning {
          border-left-color: #f39c12;
        }

        .notification-item.notification-error {
          border-left-color: #e74c3c;
        }

        .notification-item.notification-collection_update {
          border-left-color: #2ecc71;
        }

        .notification-icon {
          font-size: 24px;
          min-width: 30px;
          text-align: center;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          margin: 0 0 5px 0;
          color: #2c3e50;
          font-size: 14px;
          font-weight: 600;
        }

        .notification-message {
          margin: 0 0 8px 0;
          color: #5a6c7d;
          font-size: 13px;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 11px;
          color: #95a5a6;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: #ecf0f1;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #bdc3c7;
        }

        .action-btn.delete:hover {
          background: #e74c3c;
          color: white;
        }

        .notification-detail {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
        }

        .detail-row label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 12px;
        }

        .detail-row p {
          margin: 0;
          color: #5a6c7d;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .notifications-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .notification-item {
            flex-wrap: wrap;
          }

          .notification-actions {
            width: 100%;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
