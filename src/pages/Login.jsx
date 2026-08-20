import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import authService from '../services/authService';

export default function Login(){
 const navigate=useNavigate(); const [form,setForm]=useState({email:'',password:''}); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 const go=(type,name,email)=>{
  localStorage.setItem('token','demo-token');
  localStorage.setItem('userId','1');
  localStorage.setItem('userType',type);
  localStorage.setItem('userName',name);
  localStorage.setItem('userEmail',email);

  // Force a fresh app load so AppRoutes reads the newly selected role.
  window.location.assign(`/${type}/dashboard`);
 };
 const submit=async(e)=>{e.preventDefault();setError('');if(!form.email||!form.password){setError('Please enter your email and password.');return}setLoading(true);try{const r=await authService.login(form);const d=r.data;go(d.userType,d.userName,d.userEmail)}catch(err){setError(err.message||'Unable to sign in. You can use a demo account below.')}finally{setLoading(false)}};
 return <div className="auth-modern"><div className="auth-brand-panel"><a className="landing-logo" href="/"><span>♻</span><div><strong>SMART WASTE</strong><small>MANAGEMENT SYSTEM</small></div></a><div className="auth-visual"><div className="auth-leaf">♻</div><h1>Cleaner communities.<br/><span>Smarter collections.</span></h1><p>Connect to a digital waste-management platform built for citizens, drivers and administrators.</p><div className="auth-points"><span>✓ Real-time collection tracking</span><span>✓ GPS-enabled reporting</span><span>✓ Environmental impact analytics</span></div></div></div><div className="auth-form-panel"><div className="auth-form-card"><div className="auth-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Access your Smart Waste workspace.</p></div>{error&&<div className="auth-error">{error}</div>}<form onSubmit={submit}><label>Email address<input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><div className="auth-row"><label className="check"><input type="checkbox"/> Remember me</label><a href="#forgot">Forgot password?</a></div><button className="btn btn-primary auth-submit" disabled={loading}>{loading?'Signing in...':'Sign in'}</button></form><div className="auth-divider"><span>Quick demo</span></div><div className="demo-grid"><button type="button" onClick={()=>go('citizen','Nadine','citizen@example.com')}>👤 Citizen</button><button type="button" onClick={()=>go('driver','Jean Claude','driver@example.com')}>🚛 Driver</button><button type="button" onClick={()=>go('admin','Admin','admin@example.com')}>⚙ Admin</button></div><p className="auth-bottom">Don't have an account? <Link to="/register">Create one</Link></p></div></div></div>
}
