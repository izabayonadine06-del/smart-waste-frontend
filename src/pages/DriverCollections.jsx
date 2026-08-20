import React, { useEffect, useState } from 'react';
import collectionService from '../services/collectionService';
import '../styles/dashboard.css';

const DriverCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const driverId =
    localStorage.getItem('driverId') ||
    localStorage.getItem('userId');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError('');

      let response;

      /*
       * Try to get driver's collections from backend.
       * If your service has getDriverCollections(), use it.
       */
      if (
        typeof collectionService.getDriverCollections ===
        'function'
      ) {
        response =
          await collectionService.getDriverCollections(driverId);
      } else if (
        typeof collectionService.getCollectionsByDriver ===
        'function'
      ) {
        response =
          await collectionService.getCollectionsByDriver(
            driverId
          );
      } else if (
        typeof collectionService.getAllCollections ===
        'function'
      ) {
        response =
          await collectionService.getAllCollections();
      } else {
        throw new Error(
          'Collection service function is not available.'
        );
      }

      const data = response?.data || [];

      /*
       * If getAllCollections() was used,
       * show only collections belonging to this driver.
       */
      if (
        typeof collectionService.getAllCollections ===
          'function' &&
        typeof collectionService.getDriverCollections !==
          'function' &&
        typeof collectionService.getCollectionsByDriver !==
          'function'
      ) {
        const filtered = data.filter((item) => {
          const itemDriverId =
            item.driver_id ||
            item.driverId ||
            item.driver?.id;

          return (
            String(itemDriverId) === String(driverId)
          );
        });

        setCollections(filtered);
      } else {
        setCollections(data);
      }

    } catch (err) {
      console.error(
        'Error loading driver collections:',
        err
      );

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

  const updateCollectionStatus = async (
    id,
    newStatus
  ) => {
    try {
      if (
        typeof collectionService.updateStatus ===
        'function'
      ) {
        await collectionService.updateStatus(
          id,
          newStatus
        );
      } else if (
        typeof collectionService.updateCollectionStatus ===
        'function'
      ) {
        await collectionService.updateCollectionStatus(
          id,
          newStatus
        );
      }

      setCollections((previous) =>
        previous.map((collection) =>
          collection.id === id
            ? {
                ...collection,
                status: newStatus,
              }
            : collection
        )
      );

    } catch (err) {
      console.error(
        'Error updating collection:',
        err
      );

      alert(
        err.response?.data?.message ||
        'Failed to update collection status.'
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
      case 'collected':
        return 'status-success';

      case 'accepted':
      case 'assigned':
      case 'in_progress':
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

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <h1>🚛 My Collections</h1>

          <p>
            Manage your assigned waste collection jobs.
          </p>
        </div>

        <button
          className="btn btn-outline"
          onClick={loadCollections}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ERROR */}
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


      {/* LOADING */}
      {loading ? (

        <div className="section">

          <div className="empty-state">
            Loading collections...
          </div>

        </div>

      ) : collections.length === 0 ? (

        /* EMPTY */
        <div className="section">

          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >

            <div style={{ fontSize: '55px' }}>
              🚛
            </div>

            <h2>
              No Collections Assigned
            </h2>

            <p className="muted">
              You currently have no waste
              collection assignments.
            </p>

          </div>

        </div>

      ) : (

        /* COLLECTION LIST */
        <div className="section">

          <div className="section-header">

            <h2>
              Today's Collections
            </h2>

            <span className="muted">
              {collections.length}{' '}
              collection
              {collections.length !== 1
                ? 's'
                : ''}
            </span>

          </div>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(320px, 1fr))',
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

                {/* TITLE */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                  }}
                >

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {collection.title ||
                      collection.waste_type ||
                      collection.category ||
                      'Waste Collection'}
                  </h3>

                  <span
                    className={`status-badge ${getStatusClass(
                      collection.status
                    )}`}
                  >
                    {collection.status ||
                      'pending'}
                  </span>

                </div>


                {/* DETAILS */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '14px',
                  }}
                >

                  <div>
                    <strong>
                      📍 Location:
                    </strong>{' '}
                    {collection.address ||
                      collection.location ||
                      'Not specified'}
                  </div>


                  <div>
                    <strong>
                      ♻ Category:
                    </strong>{' '}
                    {collection.category ||
                      collection.waste_category ||
                      'Not specified'}
                  </div>


                  <div>
                    <strong>
                      ⚖ Estimated Weight:
                    </strong>{' '}
                    {collection.estimatedWeight ||
                      collection.estimated_weight ||
                      '—'}{' '}
                    kg
                  </div>


                  <div>
                    <strong>
                      👤 Citizen:
                    </strong>{' '}
                    {collection.citizen_name ||
                      collection.user_name ||
                      collection.user?.full_name ||
                      'Citizen'}
                  </div>


                  <div>
                    <strong>
                      📅 Date:
                    </strong>{' '}
                    {formatDate(
                      collection.collection_date ||
                      collection.scheduled_date ||
                      collection.createdAt ||
                      collection.created_at
                    )}
                  </div>

                </div>


                {/* ACTIONS */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px',
                    flexWrap: 'wrap',
                  }}
                >

                  {collection.status ===
                    'pending' && (

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        updateCollectionStatus(
                          collection.id,
                          'accepted'
                        )
                      }
                    >
                      ✓ Accept
                    </button>

                  )}


                  {collection.status ===
                    'accepted' && (

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        updateCollectionStatus(
                          collection.id,
                          'in_progress'
                        )
                      }
                    >
                      ▶ Start Collection
                    </button>

                  )}


                  {collection.status ===
                    'in_progress' && (

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        updateCollectionStatus(
                          collection.id,
                          'completed'
                        )
                      }
                    >
                      ✓ Complete
                    </button>

                  )}


                  {(collection.status ===
                    'completed' ||
                    collection.status ===
                      'collected') && (

                    <span
                      style={{
                        color: '#15803d',
                        fontWeight: '600',
                        padding: '10px 0',
                      }}
                    >
                      ✓ Collection Completed
                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default DriverCollections;