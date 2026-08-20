import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

const DriverNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Collection Assignment',
      message: 'You have been assigned a new waste collection in Nyamirambo.',
      type: 'assignment',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Collection Reminder',
      message: 'Your next collection is scheduled for 10:30 AM.',
      type: 'reminder',
      time: '30 minutes ago',
      read: false,
    },
    {
      id: 3,
      title: 'Collection Completed',
      message: 'Your collection in Kacyiru has been successfully completed.',
      type: 'success',
      time: '2 hours ago',
      read: true,
    },
  ]);

  useEffect(() => {
    // Later we can connect this page to the backend notification API.
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const getIcon = (type) => {
    switch (type) {
      case 'assignment':
        return '🚛';
      case 'reminder':
        return '⏰';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="page-content">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>🔔 Notifications</h1>
          <p>
            Stay updated with your waste collection assignments and activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="btn btn-primary"
            onClick={markAllAsRead}
          >
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* Notification Summary */}
      <div className="dashboard-stats">

        <div className="stat-card blue">
          <div className="stat-icon">🔔</div>
          <div>
            <div className="stat-title">Total Notifications</div>
            <div className="stat-value">
              {notifications.length}
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">●</div>
          <div>
            <div className="stat-title">Unread</div>
            <div className="stat-value">
              {unreadCount}
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✓</div>
          <div>
            <div className="stat-title">Read</div>
            <div className="stat-value">
              {notifications.length - unreadCount}
            </div>
          </div>
        </div>

      </div>

      {/* Notifications */}
      <div className="section">

        <div className="section-header">
          <h2>Recent Notifications</h2>

          <span className="muted">
            {unreadCount} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '45px' }}>🔔</div>

            <h3>No notifications</h3>

            <p>
              You don't have any notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="notifications-list">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.read ? 'unread' : ''
                }`}
              >

                {/* Icon */}
                <div className="notification-icon">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="notification-content">

                  <div className="notification-header">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="notification-dot"></span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <small className="muted">
                    {notification.time}
                  </small>

                </div>

                {/* Actions */}
                <div className="notification-actions">

                  {!notification.read && (
                    <button
                      className="btn btn-soft btn-sm"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* Quick Navigation */}
      <div className="section">

        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >

          <a
            href="/driver/dashboard"
            className="info-card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3>🏠 Dashboard</h3>
            <p>
              Return to your driver dashboard.
            </p>
          </a>

          <a
            href="/driver/collections"
            className="info-card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3>🚛 Collections</h3>
            <p>
              View your collection assignments.
            </p>
          </a>

          <a
            href="/driver/feedback"
            className="info-card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h3>💬 Feedback</h3>
            <p>
              Send feedback about your work.
            </p>
          </a>

        </div>

      </div>

      {/* Page CSS */}
      <style>{`

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .notification-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .notification-item.unread {
          border-left: 4px solid #11804a;
          background: #f7fbf8;
        }

        .notification-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #eef7f1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-header h3 {
          margin: 0;
          font-size: 16px;
          color: #24312a;
        }

        .notification-content p {
          margin: 6px 0;
          color: #66756d;
          font-size: 14px;
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #11804a;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        @media (max-width: 768px) {

          .notification-item {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .notification-content {
            min-width: calc(100% - 65px);
          }

          .notification-actions {
            width: 100%;
            margin-left: 63px;
          }

        }

      `}</style>

    </div>
  );
};

export default DriverNotifications;