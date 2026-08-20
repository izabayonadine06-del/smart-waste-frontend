import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import '../../styles/dashboard.css';

const data = [
  { month: 'Jan', collections: 100 }, { month: 'Feb', collections: 125 }, { month: 'Mar', collections: 92 },
  { month: 'Apr', collections: 150 }, { month: 'May', collections: 175 }, { month: 'Jun', collections: 118 },
  { month: 'Jul', collections: 145 }, { month: 'Aug', collections: 198 }, { month: 'Sep', collections: 135 },
  { month: 'Oct', collections: 190 }, { month: 'Nov', collections: 220 }, { month: 'Dec', collections: 170 },
];

export default function Analytics() {
  return <div className="page-content"><div className="dashboard-header"><div><h1>Analytics</h1><p>Understand collection performance and environmental impact.</p></div><button className="btn btn-primary">Download Report</button></div>
    <div className="dashboard-stats"><div className="stat-card green"><div className="stat-icon">♻</div><div><div className="stat-title">Recycled Waste</div><div className="stat-value">184 kg</div><div className="stat-subtitle">↗ 22%</div></div></div><div className="stat-card blue"><div className="stat-icon">✓</div><div><div className="stat-title">Completed</div><div className="stat-value">276</div><div className="stat-subtitle">Collections</div></div></div><div className="stat-card orange"><div className="stat-icon">🌱</div><div><div className="stat-title">CO₂ Reduction</div><div className="stat-value">92 kg</div><div className="stat-subtitle">Estimated</div></div></div></div>
    <div className="chart-card"><div className="chart-title">Monthly Collections</div><div style={{height:320}}><ResponsiveContainer><BarChart data={data}><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="collections" fill="#11804a" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div>
  </div>;
}
