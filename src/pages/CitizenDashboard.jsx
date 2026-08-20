import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import * as wasteService from '../services/wasteService';
import collectionService from '../services/collectionService';
import { notificationService } from '../services/notificationService';
import '../styles/dashboard.css';

const demoReports = [
  { id: 101, title: 'Plastic waste', category: 'Plastic', status: 'pending', address: 'Kacyiru, Kigali', createdAt: new Date().toISOString() },
  { id: 102, title: 'Household waste', category: 'Household', status: 'assigned', address: 'Nyamirambo, Kigali', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 103, title: 'Garden waste', category: 'Organic', status: 'collected', address: 'Kimihurura, Kigali', createdAt: new Date(Date.now() - 172800000).toISOString() },
];
const demoCollections = [
  { id: 301, status: 'completed', actualWeight: 12, completedAt: new Date().toISOString() },
  { id: 302, status: 'assigned', actualWeight: 8, assignedAt: new Date(Date.now() - 86400000).toISOString() },
];

const Status = ({ value }) => <span className={`status-badge ${value === 'collected' || value === 'completed' ? 'status-success' : value === 'assigned' || value === 'accepted' ? 'status-primary' : value === 'cancelled' ? 'status-danger' : 'status-warning'}`}>{value}</span>;
const Stat = ({ icon, title, value, trend, tone='' }) => <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-subtitle">↗ {trend}</div></div></div>;
const MapMock = () => <div className="modern-map"><span className="map-label" style={{left:'12%',top:'22%'}}>Kacyiru</span><span className="map-label" style={{left:'61%',top:'17%'}}>Remera</span><span className="map-label" style={{left:'38%',top:'62%'}}>Kimihurura</span><span className="map-pin" style={{left:'27%',top:'38%'}}/><span className="map-pin orange" style={{left:'64%',top:'31%'}}/><span className="map-pin blue" style={{left:'49%',top:'66%'}}/></div>;

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [collections, setCollections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem('userId') || '1';
      try {
        const [r, c, n] = await Promise.all([
          wasteService.getUserReports(userId),
          collectionService.getCitizenCollections(userId),
          notificationService.getUserNotifications(userId),
        ]);
        setReports(r.data?.length ? r.data : demoReports);
        setCollections(c.data?.length ? c.data : demoCollections);
        setNotifications(n.data || []);
      } catch {
        setReports(demoReports); setCollections(demoCollections); setNotifications([]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const completed = collections.filter(c => ['completed','collected'].includes(c.status)).length;
  const pending = reports.filter(r => ['pending','assigned'].includes(r.status)).length;
  const weight = collections.reduce((sum,c) => sum + Number(c.actualWeight || 0), 0);
  const monthly = [90,120,95,145,165,110,135,175,125,180,205,155].map((value,i)=>({month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],value}));
  const pie = [{name:'Pending',value:Math.max(1,pending)},{name:'Assigned',value:Math.max(1,reports.filter(r=>r.status==='assigned').length)},{name:'Collected',value:Math.max(1,completed)}];

  return <div className="page-content">
    <div className="dashboard-header">
      <div><h1>Citizen Dashboard</h1><p>Manage your waste requests and help keep Kigali clean.</p></div>
      <button className="btn btn-primary" onClick={() => navigate('/citizen/report-waste')}>＋ Request Waste Collection</button>
    </div>

    <div className="dashboard-stats">
      <Stat icon="♻" title="Total Reports" value={reports.length || 0} trend="12% this month" tone="blue"/>
      <Stat icon="◷" title="Pending Requests" value={pending} trend="8% this month" tone="orange"/>
      <Stat icon="✓" title="Completed Collections" value={completed} trend="15% this month" tone="green"/>
      <Stat icon="🌿" title="Waste Collected" value={`${weight} kg`} trend="22% this month"/>
    </div>

    <div className="dashboard-content">
      <div className="content-main">
        <div className="card" style={{padding:20,marginBottom:20,background:'linear-gradient(120deg,#07512f,#13834b)',color:'#fff',overflow:'hidden',position:'relative'}}>
          <div style={{maxWidth:560}}><div style={{fontSize:12,opacity:.75,marginBottom:7}}>♻ SMART COLLECTION</div><h2 style={{fontSize:23,marginBottom:8,color:'#fff'}}>Request waste collection in a few clicks.</h2><p style={{color:'rgba(255,255,255,.76)',fontSize:13,marginBottom:15}}>Choose your waste type, share your location and let the collection team handle the rest.</p><button className="btn" style={{background:'#fff',color:'#07512f'}} onClick={()=>navigate('/citizen/report-waste')}>Request Now →</button></div><div style={{position:'absolute',right:35,bottom:-15,fontSize:95,opacity:.14}}>♻</div>
        </div>

        <div className="chart-grid">
          <div className="chart-card"><div className="chart-title">Collection Activity</div><div style={{height:230}}><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Bar dataKey="value" fill="#11804a" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div>
          <div className="chart-card"><div className="chart-title">My Request Status</div><div style={{height:230}}><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={3}>{pie.map((_,i)=><Cell key={i} fill={['#f59e0b','#3b82f6','#20a45a'][i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div style={{display:'flex',gap:10,justifyContent:'center',fontSize:10,color:'#6c7b73'}}>{pie.map((p)=><span key={p.name}>● {p.name}</span>)}</div></div>
        </div>

        <div className="section" style={{marginTop:20}}><div className="section-header"><h2>Recent Waste Requests</h2><button className="btn btn-soft" onClick={()=>navigate('/citizen/my-reports')}>View All</button></div>{loading ? <div className="empty-state">Loading your requests...</div> : reports.slice(0,5).map(r=><div key={r.id} className="collection-row"><div style={{display:'flex',gap:12,alignItems:'center'}}><div className="stat-icon" style={{width:38,height:38,fontSize:16}}>♻</div><div><div className="collection-title">{r.title || r.category || 'Waste report'}</div><div className="collection-date">📍 {r.address || r.location || 'Kigali'} · {new Date(r.createdAt || '2026-08-16').toLocaleDateString()}</div></div></div><Status value={r.status || 'pending'}/></div>)}</div>

        <div className="section"><div className="section-header"><h2>Collections on Map</h2><span className="muted" style={{fontSize:12}}>Live service area</span></div><MapMock/></div>
      </div>

      <aside className="content-sidebar">
        <div className="info-card"><div className="section-header" style={{marginBottom:10}}><h3>Quick Actions</h3></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{[['♻','Request','/citizen/report-waste'],['▤','My Reports','/citizen/my-reports'],['▣','Collections','/citizen/collections'],['✦','Feedback','/citizen/feedback']].map(([i,l,p])=><button key={l} onClick={()=>navigate(p)} className="btn btn-outline" style={{fontSize:11,padding:'12px 8px',flexDirection:'column'}}><span style={{fontSize:20}}>{i}</span>{l}</button>)}</div></div>
        <div className="info-card"><h3>🌿 My Green Impact</h3><div style={{fontSize:31,fontWeight:800,color:'#0a6338'}}>1,240 <span style={{fontSize:11,color:'#6c7b73'}}>points</span></div><p style={{fontSize:12}}>You helped divert <strong>{Math.max(weight,18)} kg</strong> of waste from improper disposal.</p><div style={{height:7,background:'#edf2ee',borderRadius:8,overflow:'hidden'}}><div style={{width:'72%',height:'100%',background:'#20a45a'}}/></div><small className="muted">72% to next Green Citizen badge</small></div>
        <div className="info-card"><h3>🔔 Notifications</h3>{notifications.length ? notifications.slice(0,4).map(n=><div key={n.id} style={{padding:'10px 0',borderBottom:'1px solid #e5ebe7',fontSize:12}}>{n.message || n.title || 'New collection update'}</div>) : <p style={{fontSize:12}}>You're all caught up. Your collection updates will appear here.</p>}</div>
        <div className="info-card"><h3>♻ Waste Collection Tips</h3><ul><li>Separate recyclable materials.</li><li>Add an accurate location.</li><li>Use a photo when reporting a hotspot.</li><li>Verify completed collections.</li></ul></div>
      </aside>
    </div>
    <div className="mobile-action-bar"><a className="active" href="/citizen/dashboard">⌂<span>Home</span></a><a href="/citizen/my-reports">▤<span>Requests</span></a><a href="/citizen/report-waste">＋<span>Report</span></a><a href="/citizen/collections">▣<span>Collections</span></a><a href="/citizen/feedback">✦<span>Profile</span></a></div>
  </div>;
}
