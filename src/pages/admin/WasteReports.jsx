import { useState } from 'react';
import '../../styles/dashboard.css';

const initialReports = [
  { id: 1, type: 'Plastic waste', category: 'Plastic', location: 'Kacyiru, Kigali', status: 'Pending', priority: 'Normal' },
  { id: 2, type: 'Household waste', category: 'Household', location: 'Nyamirambo, Kigali', status: 'Assigned', priority: 'High' },
  { id: 3, type: 'Garden waste', category: 'Organic', location: 'Kimihurura, Kigali', status: 'Collected', priority: 'Normal' },
  { id: 4, type: 'Construction debris', category: 'Construction', location: 'Gisozi, Kigali', status: 'Pending', priority: 'High' },
];

export default function WasteReports() {
  const [reports, setReports] = useState(initialReports);
  const update = (id, status) => setReports(items => items.map(item => item.id === id ? { ...item, status } : item));

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <div><h1>Waste Reports</h1><p>Review citizen reports and assign collection requests.</p></div>
        <button className="btn btn-primary">＋ New Report</button>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card blue"><div className="stat-icon">▤</div><div><div className="stat-title">Total Reports</div><div className="stat-value">324</div><div className="stat-subtitle">↗ 18% this month</div></div></div>
        <div className="stat-card orange"><div className="stat-icon">◷</div><div><div className="stat-title">Pending</div><div className="stat-value">102</div><div className="stat-subtitle">Needs attention</div></div></div>
        <div className="stat-card green"><div className="stat-icon">✓</div><div><div className="stat-title">Collected</div><div className="stat-value">98</div><div className="stat-subtitle">30% of reports</div></div></div>
      </div>
      <div className="section">
        <div className="section-header"><h2>Recent Reports</h2><button className="btn btn-soft">Export</button></div>
        <div className="data-table"><table><thead><tr><th>Report</th><th>Category</th><th>Location</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{reports.map(r => <tr key={r.id}><td><strong>{r.type}</strong><br/><small className="muted">#{r.id}</small></td><td>{r.category}</td><td>📍 {r.location}</td><td>{r.priority}</td><td><span className={`status-badge ${r.status === 'Collected' ? 'status-success' : r.status === 'Assigned' ? 'status-primary' : 'status-warning'}`}>{r.status}</span></td><td><button className="btn btn-soft" onClick={() => update(r.id, r.status === 'Pending' ? 'Assigned' : 'Collected')}>{r.status === 'Pending' ? 'Assign' : r.status === 'Assigned' ? 'Complete' : 'View'}</button></td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}
