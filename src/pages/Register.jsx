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

  // Default registration role
  const [userType, setUserType] = useState('citizen');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // =========================
    // VALIDATION
    // =========================

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        'Full name, email and password are required.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    try {
      setLoading(true);

      // =========================
      // DATA SENT TO BACKEND
      // =========================

      const registrationData = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: userType,
      };

      console.log('Registration data:', registrationData);

      // =========================
      // REGISTER
      // =========================

      const response = await authService.register(registrationData);

      console.log('Registration response:', response);

      setSuccess(
        'Registration successful! Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please try again.';

      setError(message);

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

        {/* =========================
            REGISTER FORM
        ========================= */}

        <div className="auth-box">

          <div className="auth-header">
            <h1>🌍 Join Smart Waste</h1>

            <p>
              Create your account to get started
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <Alert
              type="danger"
              title="Registration Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* SUCCESS */}

          {success && (
            <Alert
              type="success"
              title="Success!"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* =========================
                ROLE
            ========================= */}

            <div className="form-group">

              <label>
                I am a *
              </label>

              <div className="user-type-selector">

                {/* CITIZEN */}

                <button
                  type="button"
                  className={`type-btn ${
                    userType === 'citizen'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setUserType('citizen')
                  }
                >
                  <div className="type-label">
                    👤 Citizen
                  </div>

                  <div className="type-desc">
                    Report and track waste
                  </div>
                </button>

                {/* DRIVER */}

                <button
                  type="button"
                  className={`type-btn ${
                    userType === 'driver'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setUserType('driver')
                  }
                >
                  <div className="type-label">
                    🚚 Driver
                  </div>

                  <div className="type-desc">
                    Collect waste
                  </div>
                </button>

                {/* ADMIN */}

                <button
                  type="button"
                  className={`type-btn ${
                    userType === 'admin'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setUserType('admin')
                  }
                >
                  <div className="type-label">
                    ⚙️ Admin
                  </div>

                  <div className="type-desc">
                    Manage system
                  </div>
                </button>

              </div>
            </div>

            {/* =========================
                NAME
            ========================= */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  First Name *
                </label>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Last Name *
                </label>

                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* =========================
                EMAIL
            ========================= */}

            <div className="form-group">

              <label>
                Email Address *
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            {/* =========================
                PHONE
            ========================= */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            {/* =========================
                ADDRESS
            ========================= */}

            <div className="form-group">

              <label>
                Address
              </label>

              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
              />

            </div>

            {/* =========================
                PASSWORD
            ========================= */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Confirm Password *
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                  required
                />

              </div>

            </div>

            {/* =========================
                TERMS
            ========================= */}

            <div className="form-group checkbox">

              <label>

                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />

                I agree to the Terms and Conditions *

              </label>

            </div>

            {/* =========================
                SUBMIT
            ========================= */}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>

          {/* =========================
              LOGIN LINK
          ========================= */}

          <div className="auth-footer">

            <p>

              Already have an account?{' '}

              <Link to="/login">
                Sign in here
              </Link>

            </p>

          </div>

        </div>

        {/* =========================
            SIDEBAR
        ========================= */}

        <div className="auth-sidebar">

          <h2>
            Get Started Today
          </h2>

          <ul className="auth-features">

            <li>
              ✓ Quick and easy registration
            </li>

            <li>
              ✓ Secure account protection
            </li>

            <li>
              ✓ Access waste management features
            </li>

            <li>
              ✓ Report waste easily
            </li>

            <li>
              ✓ Track collection requests
            </li>

            <li>
              ✓ Help keep Rwanda clean
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default Register;