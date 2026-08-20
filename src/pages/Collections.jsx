import React, { useState, useEffect } from 'react';
import { CollectionCard, StatusBadge, Modal, Alert, LoadingSpinner, MapComponent } from '../components/UIComponents';
import collectionService from '../services/collectionService';
import '../styles/dashboard.css';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [collections, filterStatus, searchTerm]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const userType = localStorage.getItem('userType') || 'citizen';
      const userId = localStorage.getItem('userId') || '1';

      let response;
      if (userType === 'driver') {
        response = await collectionService.getDriverCollections(userId);
      } else if (userType === 'citizen') {
        response = await collectionService.getCitizenCollections(userId);
      } else {
        response = await collectionService.getAllCollections();
      }

      setCollections(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCollections = () => {
    let filtered = collections;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.id.toString().includes(searchTerm) ||
        c.reportId?.toString().includes(searchTerm) ||
        c.driverName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCollections(filtered);
  };

  const handleViewDetails = (collection) => {
    setSelectedCollection(collection);
    setShowDetailModal(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading collections..." />;
  }

  const stats = {
    total: collections.length,
    pending: collections.filter(c => c.status === 'pending').length,
    inProgress: collections.filter(c => c.status === 'in_progress').length,
    completed: collections.filter(c => c.status === 'completed').length,
  };

  return (
    <div className="collections-page">
      <div className="dashboard-header">
        <h1>🚚 Collections Management</h1>
        <p>Track and manage waste collections</p>
      </div>

      {error && (
        <Alert
          type="danger"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="collections-stats">
        <div className="stat-item">
          <p className="stat-label">Total</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Pending</p>
          <p className="stat-value" style={{ color: '#f39c12' }}>{stats.pending}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">In Progress</p>
          <p className="stat-value" style={{ color: '#3498db' }}>{stats.inProgress}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Completed</p>
          <p className="stat-value" style={{ color: '#2ecc71' }}>{stats.completed}</p>
        </div>
      </div>

      <div className="collections-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by ID, Driver, or Report..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({collections.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilterStatus('in_progress')}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      <div className="collections-list-section">
        {filteredCollections.length === 0 ? (
          <div className="empty-state">
            <p>📭 No collections found</p>
            <p className="empty-subtitle">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="collections-grid">
            {filteredCollections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={{
                  id: collection.id,
                  reportId: collection.reportId,
                  driverName: collection.driverName || 'Unassigned',
                  status: collection.status,
                  assignedAt: collection.assignedAt,
                  pickupTime: collection.pickupTime,
                  completedAt: collection.completedAt,
                  actualWeight: collection.actualWeight,
                }}
                onAction={() => handleViewDetails(collection)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        title="Collection Details"
        onClose={() => setShowDetailModal(false)}
      >
        {selectedCollection && (
          <div className="collection-detail-view">
            <div className="detail-section">
              <h4>General Information</h4>
              <div className="detail-item">
                <label>Collection ID:</label>
                <span>#{selectedCollection.id}</span>
              </div>
              <div className="detail-item">
                <label>Report ID:</label>
                <span>#{selectedCollection.reportId}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <StatusBadge status={selectedCollection.status} />
              </div>
            </div>

            <div className="detail-section">
              <h4>Driver Information</h4>
              <div className="detail-item">
                <label>Driver:</label>
                <span>{selectedCollection.driverName || 'Not assigned'}</span>
              </div>
              <div className="detail-item">
                <label>Rating:</label>
                <span>{selectedCollection.driverRating ? `⭐ ${selectedCollection.driverRating}/5.0` : 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Timeline</h4>
              <div className="detail-item">
                <label>Assigned:</label>
                <span>{new Date(selectedCollection.assignedAt).toLocaleString()}</span>
              </div>
              {selectedCollection.pickupTime && (
                <div className="detail-item">
                  <label>Scheduled Pickup:</label>
                  <span>{new Date(selectedCollection.pickupTime).toLocaleString()}</span>
                </div>
              )}
              {selectedCollection.completedAt && (
                <div className="detail-item">
                  <label>Completed:</label>
                  <span>{new Date(selectedCollection.completedAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4>Collection Details</h4>
              <div className="detail-item">
                <label>Actual Weight:</label>
                <span>{selectedCollection.actualWeight ? `${selectedCollection.actualWeight} kg` : 'Pending'}</span>
              </div>
              <div className="detail-item">
                <label>Notes:</label>
                <span>{selectedCollection.collectionNotes || 'No notes'}</span>
              </div>
            </div>

            {selectedCollection.completionLatitude && selectedCollection.completionLongitude && (
              <div className="detail-section">
                <h4>Collection Location</h4>
                <MapComponent
                  latitude={selectedCollection.completionLatitude}
                  longitude={selectedCollection.completionLongitude}
                  title="Collection Completed At"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .collections-page {
          padding: 20px;
        }

        .collections-stats {
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

        .collections-controls {
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

        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
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

        .collections-list-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .collection-detail-view {
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
          .collections-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .collections-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Collections;
