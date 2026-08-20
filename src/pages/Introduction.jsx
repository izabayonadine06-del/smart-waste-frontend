import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/introduction.css';

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-page">

      {/* Navbar */}
      <nav className="intro-navbar">

        <div className="intro-logo">
          <span>♻</span>

          <div>
            <strong>SMART WASTE</strong>
            <small>MANAGEMENT SYSTEM</small>
          </div>
        </div>

        <div className="intro-nav-links">
          <button onClick={() => navigate('/login')}>
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>

      </nav>

      {/* Hero */}
      <section className="intro-hero">

        <div className="intro-content">

          <span className="intro-badge">
            ♻ Smart Waste Management
          </span>

          <h1>
            Keep Rwanda
            <br />
            <span>Clean & Green</span>
          </h1>

          <p>
            A smart platform connecting citizens,
            drivers and administrators to make waste
            collection easier, faster and more efficient.
          </p>

          <div className="intro-buttons">

            <button
              className="intro-primary-btn"
              onClick={() => navigate('/login')}
            >
              Get Started →
            </button>

            <button
              className="intro-secondary-btn"
              onClick={() =>
                document
                  .getElementById('about')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              Learn More
            </button>

          </div>

        </div>

        {/* Illustration */}
        <div className="intro-illustration">

          <div className="intro-circle">
            ♻
          </div>

          <div className="intro-card card-one">
            🗑️
            <span>
              Easy Reporting
            </span>
          </div>

          <div className="intro-card card-two">
            🚚
            <span>
              Smart Collection
            </span>
          </div>

          <div className="intro-card card-three">
            🌱
            <span>
              Cleaner Environment
            </span>
          </div>

        </div>

      </section>

      {/* About */}
      <section
        id="about"
        className="intro-about"
      >

        <h2>
          How Smart Waste Works
        </h2>

        <p>
          Our system makes waste management simple
          by connecting everyone involved in the
          collection process.
        </p>

        <div className="intro-features">

          <div className="feature-card">
            <div>👤</div>
            <h3>Citizens</h3>
            <p>
              Report waste and track your
              collection requests.
            </p>
          </div>

          <div className="feature-card">
            <div>🚛</div>
            <h3>Drivers</h3>
            <p>
              Receive assignments and manage
              collection routes.
            </p>
          </div>

          <div className="feature-card">
            <div>👨‍💼</div>
            <h3>Administrators</h3>
            <p>
              Manage users, reports and
              collection activities.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="intro-footer">

        <div>
          <strong>
            ♻ SMART WASTE MANAGEMENT SYSTEM
          </strong>
        </div>

        <p>
          Making Rwanda cleaner, one report at a time.
        </p>

        <small>
          © 2026 Smart Waste Management System
        </small>

      </footer>

    </div>
  );
};

export default Introduction;