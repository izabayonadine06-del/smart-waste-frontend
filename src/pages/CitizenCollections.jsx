import React, { useEffect, useState } from 'react';
import collectionService from '../services/collectionService';
import '../styles/dashboard.css';

const CitizenCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError('');

      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not logged in.');
      }

      const response =
        await collectionService.getCollectionsByUser(userId);

      setCollections(response?.data || []);
    } catch (err) {
      console.error('Error loading collections:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load collections.'
      );

      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
      case 'collected':
        return 'status-success';

      case 'assigned':
      case 'accepted':
        return 'status-primary';

      case 'cancelled':
        return 'status-danger';

      default:
        return 'status-warning';
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';

    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <div className="page-content">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>🚚 Collections Management</h1>
          <p>
            Track and manage your waste collections.
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={loadCollections}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <strong>Error</strong>
          <p style={{ margin: '5px 0 0' }}>
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="section">
          <div className="empty-state">
            Loading collections...
          </div>
        </div>
      ) : collections.length === 0 ? (

        /* Empty */
        <div className="section">
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <div style={{ fontSize: '50px' }}>
              🚛
            </div>

            <h2>No Collections Yet</h2>

            <p className="muted">
              Your waste collection requests will appear here.
            </p>
          </div>
        </div>

      ) : (

        /* Collections */
        <div className="section">

          <div className="section-header">
            <h2>My Collections</h2>

            <span className="muted">
              {collections.length} collection
              {collections.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >

            {collections.map((collection) => (

              <div
                key={collection.id}
                className="info-card"
                style={{
                  padding: '20px',
                }}
              >

                {/* Title */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    {collection.title ||
                      collection.waste_type ||
                      'Waste Collection'}
                  </h3>

                  <span
                    className={`status-badge ${getStatusClass(
                      collection.status
                    )}`}
                  >
                    {collection.status || 'pending'}
                  </span>
                </div>

                {/* Details */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '14px',
                  }}
                >

                  <div>
                    <strong>📍 Location:</strong>{' '}
                    {collection.address ||
                      collection.location ||
                      'Not specified'}
                  </div>

                  <div>
                    <strong>♻ Category:</strong>{' '}
                    {collection.category ||
                      collection.waste_category ||
                      'Not specified'}
                  </div>

                  <div>
                    <strong>⚖ Weight:</strong>{' '}
                    {collection.estimatedWeight ||
                      collection.estimated_weight ||
                      '—'}{' '}
                    kg
                  </div>

                  <div>
                    <strong>🚛 Driver:</strong>{' '}
                    {collection.driver_name ||
                      collection.driver?.full_name ||
                      'Not assigned'}
                  </div>

                  <div>
                    <strong>📅 Date:</strong>{' '}
                    {formatDate(
                      collection.collection_date ||
                      collection.createdAt ||
                      collection.created_at
                    )}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default CitizenCollections;