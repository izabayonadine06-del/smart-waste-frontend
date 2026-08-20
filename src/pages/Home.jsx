import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Home = () => {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <Link to="/" className="home-logo">
          <span className="logo-icon">♻</span>

          <div>
            <strong>SMART WASTE</strong>
            <small>MANAGEMENT SYSTEM</small>
          </div>
        </Link>

        <div className="home-nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>

          {/* LOGIN BUTTON */}
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>

          {/* REGISTER BUTTON */}
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>

      </nav>

      {/* ================= HERO ================= */}
      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-badge">
            ♻ Smart Waste Management
          </div>

          <h1>
            Making Rwanda
            <span> Cleaner & Smarter</span>
          </h1>

          <p>
            Smart Waste Management System connects citizens,
            drivers and administrators to make waste collection
            easier, faster and more efficient.
          </p>

          <div className="hero-buttons">

            <Link
              to="/login"
              className="btn btn-primary hero-btn"
            >
              Login to Dashboard →
            </Link>

            <Link
              to="/register"
              className="btn btn-outline hero-btn"
            >
              Create Account
            </Link>

          </div>

        </div>

        <div className="hero-illustration">
          <div className="waste-circle">
            ♻
          </div>

          <div className="floating-card card-one">
            🚛 Collection
            <strong>On the way</strong>
          </div>

          <div className="floating-card card-two">
            📍 Reports
            <strong>Tracked</strong>
          </div>

          <div className="floating-card card-three">
            🌱 Environment
            <strong>Cleaner</strong>
          </div>
        </div>

      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="home-section">

        <div className="section-title">
          <span>ABOUT SYSTEM</span>
          <h2>One platform for smarter waste management</h2>
          <p>
            Our system improves communication between citizens,
            waste collection drivers and administrators.
          </p>
        </div>

        <div className="home-cards">

          <div className="home-card">
            <div className="home-card-icon">👤</div>
            <h3>Citizens</h3>
            <p>
              Report waste, track your reports and follow
              collection activities.
            </p>
          </div>

          <div className="home-card">
            <div className="home-card-icon">🚛</div>
            <h3>Drivers</h3>
            <p>
              Receive collection assignments, manage routes
              and update collection status.
            </p>
          </div>

          <div className="home-card">
            <div className="home-card-icon">👨‍💼</div>
            <h3>Administrators</h3>
            <p>
              Manage users, waste reports, collections and
              monitor the entire system.
            </p>
          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="home-section features-section">

        <div className="section-title">
          <span>FEATURES</span>
          <h2>Everything you need</h2>
        </div>

        <div className="features-grid">

          <div className="feature">
            <span>♻</span>
            <div>
              <h3>Waste Reporting</h3>
              <p>
                Citizens can easily report different types of waste.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>🚛</span>
            <div>
              <h3>Collection Tracking</h3>
              <p>
                Track collection requests from report to completion.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>📍</span>
            <div>
              <h3>Location Tracking</h3>
              <p>
                View waste reports and collection locations.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>🔔</span>
            <div>
              <h3>Notifications</h3>
              <p>
                Receive important updates about your collections.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>📊</span>
            <div>
              <h3>Dashboard Analytics</h3>
              <p>
                Administrators can monitor system performance.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>💬</span>
            <div>
              <h3>Feedback</h3>
              <p>
                Users can provide feedback about the service.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta">

        <h2>Ready to make waste management smarter?</h2>

        <p>
          Join Smart Waste Management System today.
        </p>

        <div className="hero-buttons">

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-outline"
          >
            Register
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="home-footer">

        <div>
          <h3>♻ SMART WASTE</h3>
          <p>
            Smart Waste Management System
          </p>
        </div>

        <div>
          <p>© 2026 Smart Waste Management System</p>
          <p>Making Rwanda cleaner and smarter.</p>
        </div>

      </footer>

      {/* ================= CSS ================= */}
      <style>{`

        .home-page {
          min-height: 100vh;
          background: #f7faf8;
          color: #24312a;
        }

        .home-navbar {
          height: 72px;
          padding: 0 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border-bottom: 1px solid #e8eee9;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .home-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #24312a;
        }

        .logo-icon {
          font-size: 30px;
          color: #11804a;
        }

        .home-logo strong {
          display: block;
          font-size: 16px;
        }

        .home-logo small {
          display: block;
          font-size: 9px;
          letter-spacing: 2px;
          color: #718078;
        }

        .home-nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .home-nav-links a {
          text-decoration: none;
          color: #526158;
          font-size: 14px;
        }

        .home-nav-links .btn {
          padding: 9px 18px;
        }

        .home-hero {
          min-height: 570px;
          padding: 70px 8%;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 50px;
          background: linear-gradient(
            135deg,
            #f4faf6,
            #ffffff
          );
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 20px;
          background: #e7f6ed;
          color: #11804a;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .hero-content h1 {
          font-size: clamp(40px, 6vw, 68px);
          line-height: 1.05;
          margin: 0;
          max-width: 700px;
        }

        .hero-content h1 span {
          display: block;
          color: #11804a;
        }

        .hero-content p {
          max-width: 600px;
          margin: 22px 0;
          color: #66756d;
          font-size: 17px;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 13px 22px !important;
        }

        .hero-illustration {
          height: 400px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .waste-circle {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 110px;
          background: #e3f4e9;
          color: #11804a;
          box-shadow: 0 20px 60px rgba(17,128,74,.15);
        }

        .floating-card {
          position: absolute;
          background: white;
          padding: 14px 18px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,.1);
          font-size: 13px;
        }

        .floating-card strong {
          display: block;
          margin-top: 5px;
          color: #11804a;
        }

        .card-one {
          top: 30px;
          left: 5%;
        }

        .card-two {
          right: 0;
          top: 130px;
        }

        .card-three {
          left: 15%;
          bottom: 40px;
        }

        .home-section {
          padding: 80px 8%;
          background: white;
        }

        .section-title {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 45px;
        }

        .section-title span {
          color: #11804a;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .section-title h2 {
          font-size: 34px;
          margin: 10px 0;
        }

        .section-title p {
          color: #718078;
          line-height: 1.6;
        }

        .home-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1100px;
          margin: auto;
        }

        .home-card {
          padding: 30px;
          border: 1px solid #e5ece7;
          border-radius: 14px;
          text-align: center;
          transition: .2s;
        }

        .home-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,.07);
        }

        .home-card-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .home-card p {
          color: #718078;
          line-height: 1.6;
        }

        .features-section {
          background: #f7faf8;
        }

        .features-grid {
          max-width: 1100px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .feature {
          background: white;
          padding: 22px;
          border-radius: 12px;
          display: flex;
          gap: 18px;
          border: 1px solid #e7eee9;
        }

        .feature > span {
          font-size: 30px;
        }

        .feature h3 {
          margin: 0 0 6px;
        }

        .feature p {
          margin: 0;
          color: #718078;
          font-size: 14px;
        }

        .home-cta {
          padding: 80px 8%;
          text-align: center;
          background: #eaf7ee;
        }

        .home-cta h2 {
          font-size: 34px;
          margin-bottom: 10px;
        }

        .home-cta p {
          color: #66756d;
          margin-bottom: 25px;
        }

        .home-footer {
          padding: 35px 8%;
          background: #17251d;
          color: white;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .home-footer p {
          color: #b8c5bd;
          font-size: 13px;
        }

        @media (max-width: 800px) {

          .home-navbar {
            padding: 0 4%;
          }

          .home-nav-links a:not(.btn) {
            display: none;
          }

          .home-hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-illustration {
            height: 300px;
          }

          .home-cards {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .home-footer {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
};

export default Home;