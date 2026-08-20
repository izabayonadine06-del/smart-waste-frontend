import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import collectionService from '../services/collectionService';
import driverService from '../services/driverService';

import '../styles/dashboard.css';

/* =========================================================
   DEMO ASSIGNMENTS
========================================================= */

const demoAssignments = [
  {
    id: 1,
    title: 'Plastic Waste',
    description: 'Collection request from household',
    address: 'Kacyiru, Kigali, Rwanda',
    status: 'pending',
    priority: 'normal',
    estimatedWeight: 12,
    time: '09:00 AM',
    latitude: -1.9344,
    longitude: 30.0882,
  },
  {
    id: 2,
    title: 'Household Waste',
    description: 'Mixed household waste',
    address: 'Nyamirambo, Kigali, Rwanda',
    status: 'pending',
    priority: 'high',
    estimatedWeight: 18,
    time: '10:30 AM',
    latitude: -1.9706,
    longitude: 30.0444,
  },
  {
    id: 3,
    title: 'Garden Waste',
    description: 'Organic garden waste',
    address: 'Kimihurura, Kigali, Rwanda',
    status: 'accepted',
    priority: 'normal',
    estimatedWeight: 9,
    time: '12:00 PM',
    latitude: -1.9536,
    longitude: 30.0926,
  },
  {
    id: 4,
    title: 'Construction Debris',
    description: 'Small construction debris collection',
    address: 'Gisozi, Kigali, Rwanda',
    status: 'pending',
    priority: 'normal',
    estimatedWeight: 20,
    time: '02:30 PM',
    latitude: -1.9306,
    longitude: 30.0754,
  },
];

/* =========================================================
   STAT CARD
========================================================= */

const Stat = ({ icon, title, value, tone = '' }) => {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <div className="stat-title">
          {title}
        </div>

        <div className="stat-value">
          {value}
        </div>

        <div className="stat-subtitle">
          ↗ today
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const Status = ({ value }) => {
  let className = 'status-warning';

  if (
    value === 'accepted' ||
    value === 'assigned' ||
    value === 'in_progress'
  ) {
    className = 'status-primary';
  }

  if (
    value === 'completed' ||
    value === 'collected'
  ) {
    className = 'status-success';
  }

  if (
    value === 'cancelled'
  ) {
    className = 'status-danger';
  }

  return (
    <span className={`status-badge ${className}`}>
      {String(value || 'pending').replace('_', ' ')}
    </span>
  );
};

/* =========================================================
   MAP
========================================================= */

const DriverMap = ({ assignments }) => {
  return (
    <div className="modern-map">

      <div className="map-road road-1" />
      <div className="map-road road-2" />
      <div className="map-road road-3" />

      <span
        className="map-label"
        style={{ left: '8%', top: '15%' }}
      >
        Kacyiru
      </span>

      <span
        className="map-label"
        style={{ left: '67%', top: '20%' }}
      >
        Remera
      </span>

      <span
        className="map-label"
        style={{ left: '35%', top: '65%' }}
      >
        Kimihurura
      </span>

      <span
        className="map-label"
        style={{ left: '55%', top: '80%' }}
      >
        Gisozi
      </span>

      <span
        className="map-label"
        style={{ left: '78%', top: '55%' }}
      >
        Kicukiro
      </span>

      {assignments.slice(0, 6).map((item, index) => {

        const positions = [
          { left: '18%', top: '31%' },
          { left: '48%', top: '42%' },
          { left: '69%', top: '30%' },
          { left: '42%', top: '70%' },
          { left: '80%', top: '60%' },
          { left: '28%', top: '55%' },
        ];

        const position =
          positions[index % positions.length];

        return (
          <div
            key={item.id}
            className={`map-pin ${
              item.status === 'completed'
                ? 'green'
                : item.status === 'accepted' ||
                  item.status === 'in_progress'
                ? 'blue'
                : item.priority === 'high'
                ? 'red'
                : 'orange'
            }`}
            style={position}
            title={item.address}
          />
        );
      })}

    </div>
  );
};

/* =========================================================
   DRIVER DASHBOARD
========================================================= */

export default function DriverDashboard() {

  const [assignments, setAssignments] = useState([]);
  const [driverStatus, setDriverStatus] = useState('available');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [routeStarted, setRouteStarted] = useState(false);

  const [error, setError] = useState('');

  /* =======================================================
     DRIVER ID
  ======================================================= */

  const driverId =
    localStorage.getItem('driverId') ||
    localStorage.getItem('userId') ||
    '1';

  /* =======================================================
     LOAD ASSIGNMENTS
  ======================================================= */

  const loadAssignments = async () => {

    try {

      setError('');

      const response =
        await collectionService.getCollectionsByStatus(
          'pending'
        );

      const data =
        response?.data ||
        response?.data?.data ||
        [];

      if (Array.isArray(data) && data.length > 0) {

        setAssignments(data);

      } else {

        setAssignments(demoAssignments);
      }

    } catch (err) {

      console.warn(
        'Could not load driver assignments:',
        err
      );

      setAssignments(demoAssignments);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadAssignments();

  }, []);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadAssignments();

  };

  /* =======================================================
     DRIVER STATUS
  ======================================================= */

  const updateDriverStatus = async (nextStatus) => {

    setDriverStatus(nextStatus);

    try {

      if (
        driverService &&
        typeof driverService.updateStatus === 'function'
      ) {

        await driverService.updateStatus(
          driverId,
          nextStatus
        );

      }

    } catch (err) {

      console.warn(
        'Driver status API unavailable:',
        err
      );

    }
  };

  /* =======================================================
     START ROUTE
  ======================================================= */

  const handleStartRoute = async () => {

    if (assignments.length === 0) {

      alert(
        'There are no assignments available to start the route.'
      );

      return;
    }

    setRouteStarted(true);

    await updateDriverStatus('on_duty');

    alert(
      'Route started successfully!'
    );
  };

  /* =======================================================
     NAVIGATE TO LOCATION
  ======================================================= */

  const handleNavigate = (assignment) => {

    if (!assignment) {
      return;
    }

    let url = '';

    /*
      If latitude and longitude exist,
      use exact coordinates.
    */

    if (
      assignment.latitude &&
      assignment.longitude
    ) {

      url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${assignment.latitude},${assignment.longitude}`;

    } else {

      /*
        Otherwise use address.
      */

      const destination =
        encodeURIComponent(
          assignment.address ||
          'Kigali, Rwanda'
        );

      url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${destination}`;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* =======================================================
     ACCEPT COLLECTION
  ======================================================= */

  const handleAccept = async (assignment) => {

    try {

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? {
                ...item,
                status: 'accepted',
              }
            : item
        )
      );

      if (
        collectionService &&
        typeof collectionService.updateStatus ===
          'function'
      ) {

        await collectionService.updateStatus(
          assignment.id,
          'accepted'
        );
      }

    } catch (err) {

      console.warn(
        'Could not update collection status:',
        err
      );

      /*
        Keep UI updated in demo mode.
      */
    }
  };

  /* =======================================================
     START COLLECTION
  ======================================================= */

  const handleStartCollection = async (assignment) => {

    try {

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? {
                ...item,
                status: 'in_progress',
              }
            : item
        )
      );

      if (
        collectionService &&
        typeof collectionService.updateStatus ===
          'function'
      ) {

        await collectionService.updateStatus(
          assignment.id,
          'in_progress'
        );
      }

    } catch (err) {

      console.warn(
        'Could not start collection:',
        err
      );

    }
  };

  /* =======================================================
     COMPLETE COLLECTION
  ======================================================= */

  const handleCompleteCollection = async (assignment) => {

    try {

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? {
                ...item,
                status: 'completed',
              }
            : item
        )
      );

      if (
        collectionService &&
        typeof collectionService.updateStatus ===
          'function'
      ) {

        await collectionService.updateStatus(
          assignment.id,
          'completed'
        );
      }

    } catch (err) {

      console.warn(
        'Could not complete collection:',
        err
      );

    }
  };

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = [
    { day: 'Mon', value: 7 },
    { day: 'Tue', value: 10 },
    { day: 'Wed', value: 8 },
    { day: 'Thu', value: 13 },
    { day: 'Fri', value: 11 },
    { day: 'Sat', value: 15 },
    { day: 'Sun', value: 9 },
  ];

  /* =======================================================
     STATS
  ======================================================= */

  const totalAssignments =
    assignments.length;

  const completedToday =
    assignments.filter(
      (item) =>
        item.status === 'completed' ||
        item.status === 'collected'
    ).length;

  const pendingAssignments =
    assignments.filter(
      (item) =>
        item.status === 'pending'
    ).length;

  const acceptedAssignments =
    assignments.filter(
      (item) =>
        item.status === 'accepted' ||
        item.status === 'assigned'
    ).length;

  const nextStop =
    assignments.find(
      (item) =>
        item.status === 'accepted' ||
        item.status === 'assigned'
    ) ||
    assignments.find(
      (item) =>
        item.status === 'pending'
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="page-content">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Driver Dashboard
          </h1>

          <p>
            Manage today's assignments
            and collection routes.
          </p>

        </div>

        <div
          className="header-actions"
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >

          <button
            className="btn btn-outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? 'Refreshing...'
              : '↻ Refresh'}
          </button>

          <button
            className="btn btn-primary"
            onClick={handleStartRoute}
            disabled={routeStarted}
          >

            {routeStarted
              ? '✓ Route Started'
              : 'Start Route →'}

          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            background: '#fce8e8',
            color: '#d93025',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >

          {error}

        </div>

      )}

      {/* =================================================
          DRIVER STATUS
      ================================================= */}

      <div className="driver-status-bar">

        <div>

          <div className="stat-title">
            Current Status
          </div>

          <strong
            style={{
              textTransform: 'capitalize',
            }}
          >
            {driverStatus.replace('_', ' ')}
          </strong>

        </div>

        <div className="status-controls">

          {[
            'available',
            'on_duty',
            'on_break',
            'offline',
          ].map((item) => (

            <button
              key={item}
              className={`btn ${
                driverStatus === item
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
              onClick={() =>
                updateDriverStatus(item)
              }
            >

              {item === 'available'
                ? '✓'
                : item === 'on_duty'
                ? '●'
                : item === 'on_break'
                ? 'Ⅱ'
                : '×'}

              {' '}

              {item.replace('_', ' ')}

            </button>

          ))}

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="dashboard-stats">

        <Stat
          icon="▣"
          title="Total Assignments"
          value={totalAssignments}
          tone="blue"
        />

        <Stat
          icon="✓"
          title="Completed Today"
          value={completedToday}
          tone="green"
        />

        <Stat
          icon="◷"
          title="Pending"
          value={pendingAssignments}
          tone="orange"
        />

        <Stat
          icon="RWF"
          title="Earnings Today"
          value="45,000"
          tone="purple"
        />

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="dashboard-content">

        <div className="content-main">

          {/* =============================================
              ASSIGNMENTS
          ============================================= */}

          <div className="section">

            <div className="section-header">

              <h2>
                Today's Assignments
              </h2>

              <span
                className="muted"
                style={{
                  fontSize: '12px',
                }}
              >
                {acceptedAssignments} accepted
              </span>

            </div>

            {loading ? (

              <div className="empty-state">
                Loading assignments...
              </div>

            ) : assignments.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No assignments
                </h3>

                <p>
                  You currently have no
                  collection assignments.
                </p>

              </div>

            ) : (

              assignments.map((assignment) => (

                <div
                  className="assignment-item"
                  key={assignment.id}
                >

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <div className="assignment-header">

                      <h4>
                        {assignment.title}
                      </h4>

                      <Status
                        value={
                          assignment.status
                        }
                      />

                    </div>

                    <p className="assignment-description">
                      {assignment.description}
                    </p>

                    <div className="assignment-details">

                      <span>
                        📍{' '}
                        {assignment.address ||
                          assignment.location ||
                          'Kigali'}
                      </span>

                      <span>
                        ◷{' '}
                        {assignment.time ||
                          'Not specified'}
                      </span>

                      <span>
                        ♻{' '}
                        {assignment.estimatedWeight ||
                          assignment.weight ||
                          0}{' '}
                        kg
                      </span>

                    </div>

                  </div>

                  {/* ===================================
                      ACTIONS
                  =================================== */}

                  <div
                    className="assignment-actions"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7px',
                    }}
                  >

                    {/* PENDING */}

                    {assignment.status ===
                      'pending' && (

                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleAccept(
                            assignment
                          )
                        }
                      >
                        Accept
                      </button>

                    )}

                    {/* ACCEPTED */}

                    {(
                      assignment.status ===
                        'accepted' ||
                      assignment.status ===
                        'assigned'
                    ) && (

                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleStartCollection(
                              assignment
                            )
                          }
                        >
                          Start Collection
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            handleNavigate(
                              assignment
                            )
                          }
                        >
                          Navigate →
                        </button>
                      </>

                    )}

                    {/* IN PROGRESS */}

                    {assignment.status ===
                      'in_progress' && (

                      <>

                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleCompleteCollection(
                              assignment
                            )
                          }
                        >
                          ✓ Complete
                        </button>

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            handleNavigate(
                              assignment
                            )
                          }
                        >
                          Navigate →
                        </button>

                      </>

                    )}

                    {/* COMPLETED */}

                    {(
                      assignment.status ===
                        'completed' ||
                      assignment.status ===
                        'collected'
                    ) && (

                      <span
                        className="status-badge status-success"
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        ✓ Completed
                      </span>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

          {/* =============================================
              ROUTE MAP
          ============================================= */}

          <div className="section">

            <div className="section-header">

              <h2>
                Route Map
              </h2>

              <span
                className="muted"
                style={{
                  fontSize: '12px',
                }}
              >
                {assignments.length} stops
              </span>

            </div>

            <DriverMap
              assignments={assignments}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, 1fr)',
                gap: '10px',
                marginTop: '12px',
              }}
            >

              <div className="info-card">

                <small className="muted">
                  Distance
                </small>

                <strong>
                  34.6 km
                </strong>

              </div>

              <div className="info-card">

                <small className="muted">
                  Estimated time
                </small>

                <strong>
                  2h 45m
                </strong>

              </div>

              <div className="info-card">

                <small className="muted">
                  Completed
                </small>

                <strong>
                  {completedToday} /{' '}
                  {totalAssignments}
                </strong>

              </div>

            </div>

          </div>

          {/* =============================================
              WEEKLY CHART
          ============================================= */}

          <div className="chart-card">

            <div className="chart-title">
              Weekly Collections
            </div>

            <div
              style={{
                height: 210,
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={chartData}
                >

                  <XAxis
                    dataKey="day"
                    tick={{
                      fontSize: 10,
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#11804a"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="content-sidebar">

          {/* DRIVER PERFORMANCE */}

          <div className="info-card">

            <h3>
              🚛 Driver Performance
            </h3>

            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              4.9{' '}

              <span
                style={{
                  fontSize: 13,
                  color: '#f59e0b',
                }}
              >
                ★
              </span>

            </div>

            <p
              style={{
                fontSize: 12,
              }}
            >
              Excellent service rating
              this month.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                fontSize: 12,
              }}
            >

              <span>
                On-time rate
              </span>

              <strong>
                96%
              </strong>

            </div>

            <div
              style={{
                height: 7,
                background: '#edf2ee',
                borderRadius: 8,
                marginTop: 7,
              }}
            >

              <div
                style={{
                  width: '96%',
                  height: '100%',
                  background: '#20a45a',
                  borderRadius: 8,
                }}
              />

            </div>

          </div>

          {/* NEXT STOP */}

          <div className="info-card">

            <h3>
              📍 Next Stop
            </h3>

            {nextStop ? (

              <>

                <strong>
                  {nextStop.address ||
                    nextStop.location}
                </strong>

                <p
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {nextStop.title}
                  {' · '}
                  {nextStop.time ||
                    'Time not specified'}
                </p>

                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: 8,
                  }}
                  onClick={() =>
                    handleNavigate(
                      nextStop
                    )
                  }
                >
                  📍 Navigate →
                </button>

              </>

            ) : (

              <p
                style={{
                  fontSize: 12,
                }}
              >
                No next stop available.
              </p>

            )}

          </div>

          {/* ROUTE STATUS */}

          <div className="info-card">

            <h3>
              🛣️ Route Status
            </h3>

            <p
              style={{
                fontSize: 13,
              }}
            >
              {routeStarted
                ? 'Your route is currently active.'
                : 'Your route has not started yet.'}
            </p>

            <button
              className={`btn ${
                routeStarted
                  ? 'btn-outline'
                  : 'btn-primary'
              }`}
              style={{
                width: '100%',
              }}
              onClick={handleStartRoute}
              disabled={routeStarted}
            >
              {routeStarted
                ? '✓ Route Active'
                : 'Start Route →'}
            </button>

          </div>

          {/* NOTIFICATIONS */}

          <div className="info-card">

            <h3>
              🔔 Notifications
            </h3>

            <p
              style={{
                fontSize: 12,
              }}
            >
              You have 3 new assignment
              updates.
            </p>

          </div>

        </aside>

      </div>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      <div className="mobile-action-bar">

        <a
          className="active"
          href="/driver/dashboard"
        >
          ⌂
          <span>
            Home
          </span>
        </a>

        <a
          href="/driver/collections"
        >
          ▣
          <span>
            Jobs
          </span>
        </a>

        <a
          href="/driver/collections"
        >
          ⌖
          <span>
            Route
          </span>
        </a>

        <a
          href="/driver/notifications"
        >
          ◉
          <span>
            Alerts
          </span>
        </a>

        <a
          href="/driver/feedback"
        >
          ♙
          <span>
            Profile
          </span>
        </a>

      </div>

    </div>
  );
}