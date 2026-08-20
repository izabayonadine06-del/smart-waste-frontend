import React, { useState, useEffect } from 'react';
import {
  WasteReportCard,
  StatusBadge,
  Modal,
  Alert,
  LoadingSpinner
} from '../components/UIComponents';

import * as wasteService from '../services/wasteService';

import '../styles/dashboard.css';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, filterStatus, filterCategory, searchTerm]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '1';
      const response = await wasteService.getUserReports(userId);
      setReports(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await wasteService.deleteReport(reportId);
        setReports(reports.filter(r => r.id !== reportId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your reports..." />;
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    assigned: reports.filter(r => r.status === 'assigned').length,
    collected: reports.filter(r => r.status === 'collected').length,
  };

  const categories = ['all', ...new Set(reports.map(r => r.category))];

  return (
    <div className="my-reports-page">
      <div className="dashboard-header">
        <h1>📋 My Waste Reports</h1>
        <p>View and manage all your waste collection requests</p>
      </div>

      {error && (
        <Alert
          type="danger"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="reports-stats">
        <div className="stat-item">
          <p className="stat-label">Total Reports</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Pending</p>
          <p className="stat-value" style={{ color: '#f39c12' }}>{stats.pending}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Assigned</p>
          <p className="stat-value" style={{ color: '#3498db' }}>{stats.assigned}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Collected</p>
          <p className="stat-value" style={{ color: '#2ecc71' }}>{stats.collected}</p>
        </div>
      </div>

      <div className="reports-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="collected">Collected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="reports-list">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>📭 No reports found</p>
            <p className="empty-subtitle">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report.id} className="report-wrapper">
                <WasteReportCard
                  report={{
                    id: report.id,
                    title: report.title,
                    description: report.description,
                    category: report.category,
                    status: report.status,
                    priority: report.priority,
                    address: report.address,
                    createdAt: report.createdAt,
                    imageUrl: report.imageUrl,
                  }}
                  actionLabel="View Details"
                  onAction={() => {
                    setSelectedReport(report);
                    setShowDetailModal(true);
                  }}
                />
                <div className="report-actions">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        title="Report Details"
        onClose={() => setShowDetailModal(false)}
      >
        {selectedReport && (
          <div className="report-detail-view">
            <div className="detail-section">
              <h4>Report Information</h4>
              <div className="detail-item">
                <label>Title:</label>
                <span>{selectedReport.title}</span>
              </div>
              <div className="detail-item">
                <label>Description:</label>
                <span>{selectedReport.description}</span>
              </div>
              <div className="detail-item">
                <label>Category:</label>
                <span>{selectedReport.category}</span>
              </div>
              <div className="detail-item">
                <label>Priority:</label>
                <span>{selectedReport.priority?.toUpperCase()}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Status & Timeline</h4>
              <div className="detail-item">
                <label>Status:</label>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div className="detail-item">
                <label>Reported:</label>
                <span>{new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Location</h4>
              <div className="detail-item">
                <label>Address:</label>
                <span>{selectedReport.address}</span>
              </div>
            </div>

            {selectedReport.imageUrl && (
              <div className="detail-section">
                <h4>Photo</h4>
                <img
                  src={selectedReport.imageUrl}
                  alt="Waste"
                  style={{ maxWidth: '100%', borderRadius: '6px', maxHeight: '300px' }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .my-reports-page {
          padding: 20px;
        }

        .reports-stats {
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

        .reports-controls {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .search-box {
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .filters select {
          padding: 10px 12px;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filters select:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .reports-list {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .report-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .report-actions {
          display: flex;
          gap: 10px;
        }

        .report-actions .btn {
          flex: 1;
        }

        .report-detail-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-section {
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          padding: 15px;
          background-color: #f9fafb;
        }

        .detail-section h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ecf0f1;
          font-size: 13px;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item label {
          font-weight: 600;
          color: #2c3e50;
        }

        .detail-item span {
          color: #5a6c7d;
        }

        @media (max-width: 768px) {
          .reports-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyReports;
