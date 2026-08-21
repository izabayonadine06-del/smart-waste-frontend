import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, LoadingSpinner } from '../components/UIComponents';
import authService from '../services/authService';
import '../styles/dashboard.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userType, setUserType] = useState('citizen');
  const [formData, setFormData] = useState({
    full_name: '',      // ✅ Hindutse kuri full_name
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const registrationData = {
        full_name: formData.full_name,  // ✅ full_name
        email: formData.email,
        password: formData.password,
        role: userType,                  // ✅ role au lieu de userType
        phone: formData.phone,
        address: formData.address,
      };

      await authService.register(registrationData);
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Creating your account..." />;
  }

  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h1>🌍 Join Us</h1>
            <p>Create your account to get started</p>
          </div>

          {error && (
            <Alert
              type="danger"
              title="Registration Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {success && (
            <Alert
              type="success"
              title="Success!"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>I am a *</label>
              <div className="user-type-selector">
                {[
                  { value: 'citizen', label: '👤 Citizen', description: 'Report and track waste' },
                  { value: 'driver', label: '🚚 Driver', description: 'Collect waste' },
                  { value: 'admin', label: '⚙️ Admin', description: 'Manage system' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`type-btn ${userType === type.value ? 'active' : ''}`}
                    onClick={() => setUserType(type.value)}
                  >
                    <div className="type-label">{type.label}</div>
                    <div className="type-desc">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ✅ Full Name - Ikosowe */}
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password (min 6 chars)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  required
                />
                I agree to the Terms and Conditions *
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <h2>Get Started Today</h2>
          <ul className="auth-features">
            <li>✓ Quick and easy registration</li>
            <li>✓ Secure account protection</li>
            <li>✓ Access all features immediately</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ No hidden fees</li>
            <li>✓ Join thousands of users</li>
          </ul>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          width: 100%;
          max-width: 1000px;
        }

        .auth-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          padding: 40px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          color: #2c3e50;
        }

        .auth-header p {
          margin: 0;
          color: #95a5a6;
          font-size: 14px;
        }

        .auth-form {
          margin-bottom: 20px;
        }

        .user-type-selector {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .type-btn {
          padding: 15px;
          border: 2px solid #ecf0f1;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .type-btn:hover {
          border-color: #2ecc71;
        }

        .type-btn.active {
          background: #f0fdf4;
          border-color: #2ecc71;
        }

        .type-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .type-desc {
          font-size: 12px;
          color: #95a5a6;
          margin-top: 4px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .checkbox label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: normal;
          font-size: 13px;
        }

        .checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .btn-block {
          width: 100% !important;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #2ecc71;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ecf0f1;
        }

        .auth-footer p {
          margin: 0;
          font-size: 13px;
          color: #5a6c7d;
        }

        .auth-footer a {
          color: #2ecc71;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        .auth-sidebar {
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          border-radius: 12px;
          padding: 40px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(46, 204, 113, 0.2);
        }

        .auth-sidebar h2 {
          margin: 0 0 30px 0;
          font-size: 24px;
          line-height: 1.3;
        }

        .auth-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .auth-features li {
          margin: 15px 0;
          font-size: 15px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .auth-box {
            padding: 30px 20px;
          }

          .auth-sidebar {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .user-type-selector {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;