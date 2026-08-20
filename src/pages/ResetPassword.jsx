import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(
        response.data?.message ||
          'Password has been reset successfully.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);

      setError(
        err.response?.data?.message ||
          'Invalid or expired reset token.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>
          🔐
        </div>

        <h1 style={styles.title}>
          Reset Password
        </h1>

        <p style={styles.subtitle}>
          Create a new password for your Smart Waste account.
        </p>

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              minLength={6}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

        <div style={styles.back}>
          <Link to="/login" style={styles.link}>
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f7f5',
    padding: '20px',
  },

  card: {
    width: '100%',
    maxWidth: '430px',
    background: '#ffffff',
    padding: '40px',
    borderRadius: '14px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  },

  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#e8f7ee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    margin: '0 auto 20px',
  },

  title: {
    textAlign: 'center',
    margin: '0 0 10px',
    color: '#1f2937',
    fontSize: '28px',
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '25px',
  },

  formGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
  },

  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },

  button: {
    width: '100%',
    padding: '13px',
    border: 'none',
    borderRadius: '8px',
    background: '#11804a',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  success: {
    background: '#e8f7ee',
    color: '#15803d',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },

  error: {
    background: '#feecec',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },

  back: {
    textAlign: 'center',
    marginTop: '25px',
  },

  link: {
    color: '#11804a',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default ResetPassword;