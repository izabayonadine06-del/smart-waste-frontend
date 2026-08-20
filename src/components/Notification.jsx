import React, { useState, useEffect } from 'react';

const Notification = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const typeClasses = {
    success: 'notification-success',
    error: 'notification-error',
    warning: 'notification-warning',
    info: 'notification-info',
  };

  return (
    <div className={`notification notification-${type} ${typeClasses[type]}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Notification;
