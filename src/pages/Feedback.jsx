import React, { useState, useEffect } from 'react';
import { StatusBadge, Modal, Alert, LoadingSpinner, BarChart } from '../components/UIComponents';
import { feedbackService } from '../services/notificationService';
import '../styles/dashboard.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    isComplaint: false,
    category: 'general',
  });

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [feedback, filterStatus]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '1';
      const response = await feedbackService.getUserFeedback(userId);
      setFeedback(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedback = () => {
    let filtered = feedback;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus);
    }

    setFilteredFeedback(filtered);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const feedbackData = {
        ...formData,
        userId: localStorage.getItem('userId') || '1',
        createdAt: new Date(),
      };
      await feedbackService.createFeedback(feedbackData);
      setFormData({
        rating: 5,
        comment: '',
        isComplaint: false,
        category: 'general',
      });
      setShowForm(false);
      await loadFeedback();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && feedback.length === 0) {
    return <LoadingSpinner text="Loading feedback..." />;
  }

  const stats = {
    total: feedback.length,
    complaints: feedback.filter(f => f.isComplaint).length,
    positive: feedback.filter(f => f.rating >= 4).length,
    negative: feedback.filter(f => f.rating <= 2).length,
  };

  const ratingDistribution = [
    { label: '⭐⭐⭐⭐⭐ 5 Stars', value: feedback.filter(f => f.rating === 5).length },
    { label: '⭐⭐⭐⭐ 4 Stars', value: feedback.filter(f => f.rating === 4).length },
    { label: '⭐⭐⭐ 3 Stars', value: feedback.filter(f => f.rating === 3).length },
    { label: '⭐⭐ 2 Stars', value: feedback.filter(f => f.rating === 2).length },
    { label: '⭐ 1 Star', value: feedback.filter(f => f.rating === 1).length },
  ];

  return (
    <div className="feedback-page">
      <div className="dashboard-header">
        <h1>💬 Feedback & Complaints</h1>
        <p>Share your experience and help us improve</p>
      </div>

      {error && (
        <Alert
          type="danger"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="feedback-stats">
        <div className="stat-item">
          <p className="stat-label">Total Feedback</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Complaints</p>
          <p className="stat-value" style={{ color: '#e74c3c' }}>{stats.complaints}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Positive (4-5⭐)</p>
          <p className="stat-value" style={{ color: '#2ecc71' }}>{stats.positive}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Negative (1-2⭐)</p>
          <p className="stat-value" style={{ color: '#e74c3c' }}>{stats.negative}</p>
        </div>
      </div>

      <div className="feedback-controls">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ✏️ Write Feedback
        </button>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({feedback.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'open' ? 'active' : ''}`}
            onClick={() => setFilterStatus('open')}
          >
            Open
          </button>
          <button
            className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-main">
          {filteredFeedback.length === 0 ? (
            <div className="empty-state">
              <p>📭 No feedback yet</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Write your first feedback
              </button>
            </div>
          ) : (
            <div className="feedback-list">
              {filteredFeedback.map(item => (
                <div
                  key={item.id}
                  className={`feedback-card ${item.isComplaint ? 'complaint' : ''}`}
                  onClick={() => {
                    setSelectedFeedback(item);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="feedback-header">
                    <div className="feedback-meta">
                      <span className="feedback-rating">
                        {'⭐'.repeat(item.rating)}
                        {item.rating}
                      </span>
                      {item.isComplaint && <span className="complaint-badge">⚠️ Complaint</span>}
                    </div>
                    <StatusBadge status={item.status} size="small" />
                  </div>
                  <p className="feedback-comment">{item.comment}</p>
                  <div className="feedback-footer">
                    <span className="feedback-category">{item.category}</span>
                    <span className="feedback-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="feedback-sidebar">
          {ratingDistribution.some(r => r.value > 0) && (
            <BarChart
              data={ratingDistribution}
              title="Rating Distribution"
              xlabel="Rating"
              ylabel="Count"
            />
          )}
        </div>
      </div>

      {/* Feedback Form Modal */}
      <Modal
        isOpen={showForm}
        title="Write Feedback"
        onClose={() => setShowForm(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmitFeedback}>
              Submit Feedback
            </button>
          </>
        }
      >
        <form className="feedback-form" onSubmit={handleSubmitFeedback}>
          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-btn ${formData.rating === rating ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating })}
                >
                  {'⭐'.repeat(rating)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Feedback Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="general">General</option>
              <option value="driver">Driver</option>
              <option value="service">Service Quality</option>
              <option value="app">App/Website</option>
              <option value="payment">Payment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Feedback *</label>
            <textarea
              placeholder="Share your experience..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows="5"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.isComplaint}
                onChange={(e) => setFormData({ ...formData, isComplaint: e.target.checked })}
              />
              This is a complaint
            </label>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        title="Feedback Details"
        onClose={() => setShowDetailModal(false)}
      >
        {selectedFeedback && (
          <div className="feedback-detail">
            <div className="detail-row">
              <label>Rating:</label>
              <span>{'⭐'.repeat(selectedFeedback.rating)} {selectedFeedback.rating}/5</span>
            </div>
            <div className="detail-row">
              <label>Type:</label>
              <span>{selectedFeedback.isComplaint ? '⚠️ Complaint' : '💬 Feedback'}</span>
            </div>
            <div className="detail-row">
              <label>Category:</label>
              <span>{selectedFeedback.category}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <StatusBadge status={selectedFeedback.status} />
            </div>
            <div className="detail-row">
              <label>Comment:</label>
              <p>{selectedFeedback.comment}</p>
            </div>
            {selectedFeedback.response && (
              <div className="detail-row">
                <label>Admin Response:</label>
                <p>{selectedFeedback.response}</p>
              </div>
            )}
            <div className="detail-row">
              <label>Date:</label>
              <span>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .feedback-page {
          padding: 20px;
        }

        .feedback-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-item {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-label {
          margin: 0;
          font-size: 12px;
          color: #95a5a6;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          margin: 8px 0 0 0;
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
        }

        .feedback-controls {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
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

        .feedback-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
        }

        .feedback-main {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feedback-card {
          border: 1px solid #ecf0f1;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 4px solid #3498db;
        }

        .feedback-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .feedback-card.complaint {
          border-left-color: #e74c3c;
          background-color: #fff5f5;
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .feedback-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feedback-rating {
          font-weight: 600;
          color: #f39c12;
        }

        .complaint-badge {
          background-color: #e74c3c;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .feedback-comment {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 14px;
          line-height: 1.5;
        }

        .feedback-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #95a5a6;
        }

        .feedback-category {
          background-color: #ecf0f1;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .rating-select {
          display: flex;
          gap: 10px;
        }

        .rating-btn {
          flex: 1;
          padding: 10px;
          border: 2px solid #ecf0f1;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .rating-btn:hover {
          border-color: #f39c12;
        }

        .rating-btn.active {
          background: #fff3cd;
          border-color: #f39c12;
        }

        .checkbox label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: normal;
        }

        .checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .feedback-sidebar {
          background: white;
          border-radius: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .feedback-detail {
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

        .detail-row span, .detail-row p {
          color: #5a6c7d;
          font-size: 13px;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .feedback-content {
            grid-template-columns: 1fr;
          }

          .feedback-sidebar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .feedback-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-buttons {
            width: 100%;
            flex-wrap: wrap;
          }

          .rating-select {
            flex-wrap: wrap;
          }

          .rating-btn {
            flex: 0 1 calc(50% - 5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Feedback;
