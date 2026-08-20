import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';

import * as userService from '../services/userService';
import * as wasteService from '../services/wasteService';
import * as collectionService from '../services/collectionService';

import '../styles/dashboard.css';

/* =========================================================
   DEMO DATA
========================================================= */

const reportsDemo = [
  {
    id: 1,
    title: 'Plastic Waste',
    description: 'Plastic waste reported in the area',
    category: 'Plastic',
    priority: 'normal',
    status: 'pending',
    address: 'Kacyiru, Kigali',
    createdAt: '2026-08-16'
  },
  {
    id: 2,
    title: 'Household Waste',
    description: 'Household waste needs collection',
    category: 'Household',
    priority: 'high',
    status: 'assigned',
    address: 'Nyamirambo, Kigali',
    createdAt: '2026-08-15'
  },
  {
    id: 3,
    title: 'Garden Waste',
    description: 'Organic garden waste',
    category: 'Organic',
    priority: 'normal',
    status: 'collected',
    address: 'Kimihurura, Kigali',
    createdAt: '2026-08-14'
  },
  {
    id: 4,
    title: 'Construction Debris',
    description: 'Construction waste reported',
    category: 'Construction',
    priority: 'high',
    status: 'pending',
    address: 'Gisozi, Kigali',
    createdAt: '2026-08-14'
  }
];

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: 'warning',
    assigned: 'primary',
    collected: 'success',
    completed: 'success',
    cancelled: 'danger',
    active: 'success',
    inactive: 'warning',
    suspended: 'danger'
  };

  return (
    <span
      className={`status-badge ${
        statusMap[status] || 'default'
      }`}
    >
      {status || 'unknown'}
    </span>
  );
};

/* =========================================================
   ROLE BADGE
========================================================= */

const RoleBadge = ({ role }) => {
  return (
    <span className={`role-badge ${role || 'user'}`}>
      {role === 'user' ? 'Citizen' : role}
    </span>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  title,
  value,
  trend,
  color
}) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon-wrapper">
        <span className="stat-icon-text">
          {icon}
        </span>
      </div>

      <div className="stat-info">
        <div className="stat-title">
          {title}
        </div>

        <div className="stat-value">
          {value}
        </div>

        <div className="stat-trend">
          ↗ {trend}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   USER MODAL
========================================================= */

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  isEditing,
  saving
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        password: '',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        status: 'active'
      });
    }
  }, [user, isEditing, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSave(formData);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* Header */}
        <div className="modal-header">

          <div>
            <h2>
              {isEditing
                ? 'Edit User'
                : 'Add New User'}
            </h2>

            <p>
              {isEditing
                ? 'Update user information'
                : 'Create a new user account'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>
              Role *
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">
                Citizen
              </option>

              <option value="driver">
                Driver
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          {/* Password */}
          {!isEditing && (
            <div className="form-group">

              <label>
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                minLength={6}
                required
              />

            </div>
          )}

          {/* Status */}
          <div className="form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

              <option value="suspended">
                Suspended
              </option>
            </select>

          </div>

          {/* Buttons */}
          <div className="modal-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : isEditing
                ? 'Update User'
                : 'Create User'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

/* =========================================================
   KIGALI MAP
========================================================= */

const KigaliMap = ({ reports }) => {

  return (
    <div className="kigali-map">

      {/* Map background */}
      <div className="map-road road-1" />
      <div className="map-road road-2" />
      <div className="map-road road-3" />
      <div className="map-road road-4" />

      {/* Districts */}

      <div
        className="district-label"
        style={{
          left: '17%',
          top: '22%'
        }}
      >
        Kacyiru
      </div>

      <div
        className="district-label"
        style={{
          left: '68%',
          top: '20%'
        }}
      >
        Remera
      </div>

      <div
        className="district-label"
        style={{
          left: '42%',
          top: '48%'
        }}
      >
        Kimihurura
      </div>

      <div
        className="district-label"
        style={{
          left: '24%',
          top: '70%'
        }}
      >
        Nyamirambo
      </div>

      <div
        className="district-label"
        style={{
          left: '70%',
          top: '70%'
        }}
      >
        Kicukiro
      </div>

      <div
        className="district-label"
        style={{
          left: '48%',
          top: '82%'
        }}
      >
        Gisozi
      </div>

      {/* Report markers */}

      {reports.slice(0, 10).map(
        (report, index) => {

          const positions = [
            ['21%', '27%'],
            ['72%', '25%'],
            ['47%', '45%'],
            ['29%', '68%'],
            ['72%', '67%'],
            ['51%', '78%'],
            ['60%', '35%'],
            ['35%', '55%']
          ];

          const position =
            positions[
              index % positions.length
            ];

          return (
            <div
              key={report.id || index}
              className={`map-marker ${
                report.status || 'pending'
              }`}
              style={{
                left: position[0],
                top: position[1]
              }}
              title={
                report.title ||
                'Waste Report'
              }
            >
              ●
            </div>
          );
        }
      )}

      {/* Map legend */}

      <div className="map-legend">

        <div>
          <span className="legend-dot pending" />
          Pending
        </div>

        <div>
          <span className="legend-dot assigned" />
          Assigned
        </div>

        <div>
          <span className="legend-dot collected" />
          Collected
        </div>

      </div>

      <div className="map-title">
        Kigali Waste Collection Map
      </div>

    </div>
  );
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const AdminDashboard = () => {

  /* =======================================================
     STATE
  ======================================================= */

  const [users, setUsers] = useState([]);

  const [reports, setReports] =
    useState(reportsDemo);

  const [collections, setCollections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [savingUser, setSavingUser] =
    useState(false);

  const [showUserModal, setShowUserModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 8;

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  /* =======================================================
     CHART DATA
  ======================================================= */

  const trendData = [
    { day: '1', value: 25 },
    { day: '5', value: 40 },
    { day: '10', value: 35 },
    { day: '15', value: 58 },
    { day: '20', value: 48 },
    { day: '25', value: 70 },
    { day: '30', value: 78 }
  ];

  const monthlyData = [
    100,
    125,
    92,
    150,
    175,
    118,
    145,
    198,
    135,
    190,
    220,
    170
  ].map((value, index) => ({
    month: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ][index],
    value
  }));

  const pieData = [
    {
      name: 'Pending',
      value: reports.filter(
        (r) => r.status === 'pending'
      ).length || 102
    },
    {
      name: 'Assigned',
      value: reports.filter(
        (r) => r.status === 'assigned'
      ).length || 88
    },
    {
      name: 'Collected',
      value: reports.filter(
        (r) => r.status === 'collected'
      ).length || 98
    },
    {
      name: 'Cancelled',
      value: reports.filter(
        (r) => r.status === 'cancelled'
      ).length || 36
    }
  ];

  const chartColors = [
    '#f59e0b',
    '#3b82f6',
    '#20a45a',
    '#ef4444'
  ];

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {

    setLoading(true);

    setError('');

    try {

      const [
        usersResponse,
        reportsResponse,
        collectionsResponse
      ] = await Promise.allSettled([
        userService.getAllUsers(),
        wasteService.getAllReports(),
        collectionService.getAllCollections()
      ]);

      /* Users */

      if (
        usersResponse.status === 'fulfilled'
      ) {

        const response =
          usersResponse.value;

        const data =
          response?.data ||
          response ||
          [];

        setUsers(
          Array.isArray(data)
            ? data
            : []
        );
      }

      /* Reports */

      if (
        reportsResponse.status === 'fulfilled'
      ) {

        const response =
          reportsResponse.value;

        const data =
          response?.data ||
          response ||
          [];

        if (Array.isArray(data)) {
          setReports(data);
        }
      }

      /* Collections */

      if (
        collectionsResponse.status === 'fulfilled'
      ) {

        const response =
          collectionsResponse.value;

        const data =
          response?.data ||
          response ||
          [];

        setCollections(
          Array.isArray(data)
            ? data
            : []
        );
      }

    } catch (err) {

      console.error(
        'Dashboard loading error:',
        err
      );

    } finally {

      setLoading(false);

    }
  };

  /* =======================================================
     ADD / EDIT USER
  ======================================================= */

  const handleSaveUser = async (
    userData
  ) => {

    setSavingUser(true);

    setError('');
    setMessage('');

    try {

      if (editingUser) {

        const response =
          await userService.updateUser(
            editingUser.id,
            userData
          );

        const updatedUser =
          response?.data ||
          response ||
          {
            ...editingUser,
            ...userData
          };

        setUsers((previousUsers) =>
          previousUsers.map(
            (user) =>
              user.id === editingUser.id
                ? {
                    ...user,
                    ...updatedUser,
                    ...userData
                  }
                : user
          )
        );

        setMessage(
          'User updated successfully.'
        );

      } else {

        const response =
          await userService.createUser(
            userData
          );

        const newUser =
          response?.data ||
          response;

        if (newUser) {

          setUsers((previousUsers) => [
            ...previousUsers,
            newUser
          ]);

        }

        setMessage(
          'User created successfully.'
        );
      }

      setShowUserModal(false);
      setEditingUser(null);

    } catch (err) {

      console.error(
        'Save user error:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save user.'
      );

    } finally {

      setSavingUser(false);

    }
  };

  /* =======================================================
     EDIT USER
  ======================================================= */

  const handleEditUser = (user) => {

    setEditingUser(user);

    setShowUserModal(true);

    setError('');
    setMessage('');
  };

  /* =======================================================
     DELETE USER
  ======================================================= */

  const handleDeleteUser = async (
    userId
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this user?'
      );

    if (!confirmed) {
      return;
    }

    try {

      await userService.deleteUser(
        userId
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) =>
            user.id !== userId
        )
      );

      setMessage(
        'User deleted successfully.'
      );

    } catch (err) {

      console.error(
        'Delete user error:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete user.'
      );
    }
  };

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {

    const term =
      searchTerm.toLowerCase().trim();

    if (!term) {
      return users;
    }

    return users.filter((user) => {

      const name =
        user.full_name ||
        user.name ||
        '';

      const email =
        user.email ||
        '';

      const phone =
        user.phone ||
        '';

      const role =
        user.role ||
        '';

      return (
        name
          .toLowerCase()
          .includes(term) ||

        email
          .toLowerCase()
          .includes(term) ||

        phone
          .toLowerCase()
          .includes(term) ||

        role
          .toLowerCase()
          .includes(term)
      );
    });

  }, [users, searchTerm]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.ceil(
      filteredUsers.length /
      usersPerPage
    );

  const indexOfLastUser =
    currentPage *
    usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser -
    usersPerPage;

  const currentUsers =
    filteredUsers.slice(
      indexOfFirstUser,
      indexOfLastUser
    );

  /* =======================================================
     RESET PAGE ON SEARCH
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalUsers =
    users.length;

  const totalDrivers =
    users.filter(
      (user) =>
        user.role === 'driver'
    ).length;

  const totalReports =
    reports.length;

  const totalCollections =
    collections.length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="admin-dashboard">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Here's what's happening in
            your Smart Waste system today.
          </p>

        </div>

        <div className="header-actions">

          <button
            type="button"
            className="btn btn-outline"
            onClick={loadDashboardData}
          >
            ↻ Refresh
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
              setError('');
              setMessage('');
            }}
          >
            + Add User
          </button>

        </div>

      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

      {message && (
        <div className="dashboard-alert success">
          {message}
        </div>
      )}

      {error && (
        <div className="dashboard-alert error">
          {error}
        </div>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="stats-grid">

        <StatCard
          icon="👥"
          title="Total Users"
          value={totalUsers}
          trend="12% this month"
          color="blue"
        />

        <StatCard
          icon="🚛"
          title="Total Drivers"
          value={totalDrivers}
          trend="8% this month"
          color="green"
        />

        <StatCard
          icon="📄"
          title="Waste Reports"
          value={totalReports}
          trend="18% this month"
          color="orange"
        />

        <StatCard
          icon="♻️"
          title="Collections"
          value={totalCollections}
          trend="22% this month"
          color="purple"
        />

      </div>

      {/* ===================================================
          CHARTS
      =================================================== */}

      <div className="charts-grid">

        {/* Line chart */}

        <div className="chart-card">

          <h3>
            Waste Reports Overview
          </h3>

          <div
            style={{
              width: '100%',
              height: 250
            }}
          >

            <ResponsiveContainer>

              <LineChart
                data={trendData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eef1f4"
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 10
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 10
                  }}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#11804a"
                  strokeWidth={3}
                  dot={{
                    r: 3
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Pie chart */}

        <div className="chart-card">

          <h3>
            Reports by Status
          </h3>

          <div
            style={{
              width: '100%',
              height: 250
            }}
          >

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >

                  {pieData.map(
                    (item, index) => (
                      <Cell
                        key={item.name}
                        fill={
                          chartColors[
                            index %
                            chartColors.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================================
          USER MANAGEMENT
      =================================================== */}

      <div className="section">

        <div className="section-header">

          <div>

            <h2>
              👥 User Management
            </h2>

          </div>

          <div className="section-actions">

            <div className="search-box">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setSearchTerm('')
                  }
                >
                  ×
                </button>
              )}

            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditingUser(null);
                setShowUserModal(true);
                setError('');
                setMessage('');
              }}
            >
              + Add User
            </button>

          </div>

        </div>

        {/* Table */}

        <div className="table-container">

          <table className="data-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    Loading users...
                  </td>

                </tr>

              ) : currentUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                currentUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                    >

                      <td>
                        <strong>
                          {user.full_name ||
                            user.name ||
                            'Unknown'}
                        </strong>
                      </td>

                      <td>
                        {user.email || '—'}
                      </td>

                      <td>
                        {user.phone || '—'}
                      </td>

                      <td>
                        <RoleBadge
                          role={user.role}
                        />
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            user.status ||
                            'active'
                          }
                        />
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="btn-icon edit"
                            onClick={() =>
                              handleEditUser(
                                user
                              )
                            }
                            title="Edit user"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="btn-icon delete"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                            title="Delete user"
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="pagination">

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
            >
              Previous
            </button>

            <span>
              Page {currentPage} of{' '}
              {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
            >
              Next
            </button>

          </div>

        )}

      </div>

      {/* ===================================================
          MAP + MONTHLY COLLECTIONS
      =================================================== */}

      <div className="two-column-grid">

        {/* Kigali Map */}

        <div className="section">

          <div className="section-header">

            <h2>
              🗺️ Collections Map
            </h2>

            <span className="muted">
              {totalCollections ||
                0}{' '}
              collections
            </span>

          </div>

          <KigaliMap
            reports={reports}
          />

        </div>

        {/* Monthly chart */}

        <div className="chart-card">

          <h3>
            Monthly Collections
          </h3>

          <div
            style={{
              width: '100%',
              height: 300
            }}
          >

            <ResponsiveContainer>

              <BarChart
                data={monthlyData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eef1f4"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 10
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
                    0
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================================
          RECENT REPORTS
      =================================================== */}

      <div className="section">

        <div className="section-header">

          <h2>
            📋 Recent Waste Reports
          </h2>

          <button
            type="button"
            className="btn btn-soft"
            onClick={loadDashboardData}
          >
            Refresh Reports
          </button>

        </div>

        <div className="table-container">

          <table className="data-table">

            <thead>

              <tr>

                <th>
                  Report
                </th>

                <th>
                  Category
                </th>

                <th>
                  Location
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {reports
                .slice(0, 5)
                .map((report) => (

                  <tr
                    key={report.id}
                  >

                    <td>

                      <strong>
                        {report.title ||
                          report.name ||
                          'Waste Report'}
                      </strong>

                      <br />

                      <small className="muted">
                        #{report.id}
                      </small>

                    </td>

                    <td>
                      {report.category ||
                        '—'}
                    </td>

                    <td>
                      📍{' '}
                      {report.address ||
                        report.location ||
                        'Kigali'}
                    </td>

                    <td>

                      <span
                        className={`priority-badge ${
                          report.priority ||
                          'normal'
                        }`}
                      >
                        {report.priority ||
                          'normal'}
                      </span>

                    </td>

                    <td>

                      <StatusBadge
                        status={
                          report.status ||
                          'pending'
                        }
                      />

                    </td>

                    <td>
                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================================
          USER MODAL
      =================================================== */}

      <UserModal
        isOpen={showUserModal}
        onClose={() => {

          if (savingUser) {
            return;
          }

          setShowUserModal(false);
          setEditingUser(null);

        }}
        onSave={handleSaveUser}
        user={editingUser}
        isEditing={
          Boolean(editingUser)
        }
        saving={savingUser}
      />

    </div>
  );
};

export default AdminDashboard;