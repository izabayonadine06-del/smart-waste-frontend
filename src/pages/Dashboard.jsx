import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, LoadingSpinner } from '../components/UIComponents';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('userType');
    if (!user) {
      navigate('/login');
    } else {
      setUserType(user);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!loading && userType) {
      if (userType === 'citizen') navigate('/citizen/dashboard');
      else if (userType === 'driver') navigate('/driver/dashboard');
      else if (userType === 'admin') navigate('/admin/dashboard');
    }
  }, [userType, loading, navigate]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  return null;
};

export default Dashboard;
