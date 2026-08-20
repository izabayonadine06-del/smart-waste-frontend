import React, { useState } from 'react'
import './Presentation.css'

// Icons as inline SVG components
const IconCard = ({ icon: Icon, title, description }) => (
  <div className="pw-icon-card">
    <div className="pw-icon-box">{Icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
)

const Section = ({ title, children, className = '' }) => (
  <section className={`pw-section ${className}`}>
    <h2 className="pw-section-title">{title}</h2>
    <div className="pw-section-body">{children}</div>
  </section>
)

const BenefitCard = ({ number, title, description, icon }) => (
  <div className="pw-benefit-card">
    <div className="pw-benefit-number">{number}</div>
    <div className="pw-benefit-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
)

const TimelineStep = ({ number, title, description }) => (
  <div className="pw-timeline-step">
    <div className="pw-timeline-marker">{number}</div>
    <div className="pw-timeline-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
)

export default function Presentation() {
  const [activeTab, setActiveTab] = useState('citizens')

  const userProfiles = {
    citizens: {
      icon: '👤',
      title: 'Citizens & Residents',
      points: [
        'Request waste pickup on-demand via mobile app',
        'Schedule collection at convenient times',
        'Track collection status in real-time',
        'Reduce waste in homes and public spaces',
        'Contribute to environmental sustainability'
      ]
    },
    drivers: {
      icon: '🚚',
      title: 'Drivers & Waste Collectors',
      points: [
        'Receive optimized collection routes',
        'Real-time request notifications',
        'Navigate efficiently to reduce fuel costs',
        'Track earnings and performance metrics',
        'Improved work organization and scheduling'
      ]
    },
    admins: {
      icon: '📊',
      title: 'Administrators & Authorities',
      points: [
        'Monitor all collection activities in real-time',
        'Access comprehensive analytics dashboard',
        'Manage users, drivers, and service areas',
        'Generate reports for decision-making',
        'Optimize resources and budgeting'
      ]
    }
  }

  return (
    <div className="pw-container">
      {/* Hero Section */}
      <header className="pw-hero-section">
        <div className="pw-hero-content">
          <div className="pw-hero-badge">INNOVATION IN WASTE MANAGEMENT</div>
          <h1 className="pw-hero-title">Smart Waste Management System</h1>
          <p className="pw-hero-subtitle">Cleaner • Smarter • More Transparent • Sustainable</p>
          <p className="pw-hero-description">
            A digital platform connecting citizens, drivers, and administrators to revolutionize 
            waste collection, reduce environmental pollution, and build healthier communities.
          </p>
          <div className="pw-hero-cta">
            <button className="pw-btn-primary pw-btn-lg">View Full Presentation</button>
            <button className="pw-btn-outline pw-btn-lg">Download Pitch Deck</button>
          </div>
        </div>
        <div className="pw-hero-visual">
          <div className="pw-visual-element">🌍</div>
        </div>
      </header>

      <main className="pw-main">
        {/* Problem Statement */}
        <Section title="The Problem Statement" className="pw-problem-section">
          <div className="pw-problem-grid">
            <div className="pw-problem-card">
              <div className="pw-problem-icon">❌</div>
              <h4>Lack of Communication</h4>
              <p>Citizens cannot easily request waste collection; authorities lack visibility</p>
            </div>
            <div className="pw-problem-card">
              <div className="pw-problem-icon">🚫</div>
              <h4>Inefficient Operations</h4>
              <p>Drivers follow arbitrary routes; collection delays persist</p>
            </div>
            <div className="pw-problem-card">
              <div className="pw-problem-icon">⚠️</div>
              <h4>Environmental & Health Risks</h4>
              <p>Waste accumulation, illegal dumping, pollution, and public health hazards</p>
            </div>
            <div className="pw-problem-card">
              <div className="pw-problem-icon">📉</div>
              <h4>Lack of Transparency</h4>
              <p>No data tracking, accountability, or performance metrics</p>
            </div>
          </div>
        </Section>

        {/* Solution Overview */}
        <Section title="Our Innovative Solution" className="pw-solution-section">
          <div className="pw-solution-highlight">
            <div className="pw-solution-icon">💡</div>
            <p>
              A centralized, mobile-first digital platform that connects all stakeholders—citizens, 
              drivers, and administrators—in a real-time ecosystem for efficient, transparent, 
              and sustainable waste management.
            </p>
          </div>
          <div className="pw-solution-flow">
            <div className="pw-flow-item">
              <div className="pw-flow-number">1</div>
              <h4>Citizens Report</h4>
              <p>Submit waste requests with location & category</p>
            </div>
            <div className="pw-flow-arrow">→</div>
            <div className="pw-flow-item">
              <div className="pw-flow-number">2</div>
              <h4>Smart Assignment</h4>
              <p>System assigns nearest available driver</p>
            </div>
            <div className="pw-flow-arrow">→</div>
            <div className="pw-flow-item">
              <div className="pw-flow-number">3</div>
              <h4>Real-Time Tracking</h4>
              <p>Users track collection in real-time</p>
            </div>
            <div className="pw-flow-arrow">→</div>
            <div className="pw-flow-item">
              <div className="pw-flow-number">4</div>
              <h4>Analytics & Insights</h4>
              <p>Admins monitor and optimize operations</p>
            </div>
          </div>
        </Section>

        {/* Target Users */}
        <Section title="Who We Serve" className="pw-users-section">
          <div className="pw-tab-buttons">
            {Object.keys(userProfiles).map(key => (
              <button
                key={key}
                className={`pw-tab-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {userProfiles[key].icon} {userProfiles[key].title}
              </button>
            ))}
          </div>
          <div className="pw-user-profile">
            <div className="pw-profile-icon">{userProfiles[activeTab].icon}</div>
            <div className="pw-profile-content">
              <h3>{userProfiles[activeTab].title}</h3>
              <ul className="pw-profile-points">
                {userProfiles[activeTab].points.map((point, idx) => (
                  <li key={idx}>✓ {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Key Features */}
        <Section title="Core Features" className="pw-features-section">
          <div className="pw-features-grid">
            <IconCard
              icon="📱"
              title="Mobile-First Platform"
              description="Intuitive app for citizens, drivers, and admin dashboard"
            />
            <IconCard
              icon="📍"
              title="Real-Time GPS Tracking"
              description="Location-based waste requests and collection tracking"
            />
            <IconCard
              icon="🤖"
              title="Smart Route Optimization"
              description="AI-powered efficient route planning for drivers"
            />
            <IconCard
              icon="🔔"
              title="Instant Notifications"
              description="Real-time alerts for requests, updates, and completion"
            />
            <IconCard
              icon="💳"
              title="Payment Management"
              description="Secure digital payments and transaction history"
            />
            <IconCard
              icon="📊"
              title="Analytics Dashboard"
              description="Real-time metrics and actionable insights for admins"
            />
            <IconCard
              icon="✅"
              title="Waste Categorization"
              description="Multiple waste types for proper segregation"
            />
            <IconCard
              icon="⭐"
              title="Feedback & Ratings"
              description="Quality control through user reviews and ratings"
            />
            <IconCard
              icon="👥"
              title="User Management"
              description="Complete user lifecycle and role-based access"
            />
          </div>
        </Section>

        {/* Benefits & Impact */}
        <Section title="10 Expected Benefits" className="pw-benefits-section">
          <div className="pw-benefits-grid">
            <BenefitCard
              number="1"
              title="Reduce Collection Delays"
              description="On-demand requests eliminate waiting times"
              icon="⚡"
            />
            <BenefitCard
              number="2"
              title="Eliminate Illegal Dumping"
              description="Transparent tracking and accountability deter illegal activities"
              icon="🚫"
            />
            <BenefitCard
              number="3"
              title="Better Communication"
              description="Real-time platform connects all stakeholders seamlessly"
              icon="💬"
            />
            <BenefitCard
              number="4"
              title="Full Transparency"
              description="Complete audit trail of all waste management operations"
              icon="👁️"
            />
            <BenefitCard
              number="5"
              title="Operational Monitoring"
              description="Live dashboard tracks activities and performance metrics"
              icon="📊"
            />
            <BenefitCard
              number="6"
              title="Cleaner Environment"
              description="Reduced waste accumulation and pollution in communities"
              icon="🌱"
            />
            <BenefitCard
              number="7"
              title="Optimized Routes"
              description="Smart routing saves time and reduces driver workload"
              icon="🗺️"
            />
            <BenefitCard
              number="8"
              title="Lower Emissions"
              description="Efficient routing reduces fuel consumption and carbon footprint"
              icon="🌍"
            />
            <BenefitCard
              number="9"
              title="Urban Sanitation"
              description="Measurably improves community cleanliness and public health"
              icon="🏙️"
            />
            <BenefitCard
              number="10"
              title="Data-Driven Decisions"
              description="Actionable insights support better waste management policies"
              icon="📈"
            />
          </div>
        </Section>

        {/* How It Works */}
        <Section title="How It Solves The Problem" className="pw-how-it-works">
          <div className="pw-how-content">
            <div className="pw-how-step">
              <div className="pw-step-number">1</div>
              <h4>Digital Accessibility</h4>
              <p>
                Citizens download the app and can request waste collection in seconds from anywhere, 
                eliminating communication barriers.
              </p>
            </div>
            <div className="pw-how-step">
              <div className="pw-step-number">2</div>
              <h4>Smart Assignment</h4>
              <p>
                The system uses location data to assign the nearest available driver, reducing response 
                time and optimizing resource utilization.
              </p>
            </div>
            <div className="pw-how-step">
              <div className="pw-step-number">3</div>
              <h4>Real-Time Visibility</h4>
              <p>
                Drivers get optimized routes; citizens track collection live; administrators see everything 
                in real-time, ensuring accountability.
              </p>
            </div>
            <div className="pw-how-step">
              <div className="pw-step-number">4</div>
              <h4>Data-Driven Impact</h4>
              <p>
                Analytics reveal patterns, support better planning, reduce illegal dumping through 
                transparency, and enable measurable environmental improvements.
              </p>
            </div>
          </div>
        </Section>

        {/* Implementation Roadmap */}
        <Section title="Implementation Roadmap" className="pw-roadmap-section">
          <div className="pw-timeline">
            <TimelineStep
              number="Phase 1"
              title="Core Backend Development"
              description="Build APIs for waste requests, driver assignment, real-time tracking, and payment processing"
            />
            <TimelineStep
              number="Phase 2"
              title="Mobile & Web Apps"
              description="Develop responsive citizen app, driver dashboard, and admin panel with intuitive UX"
            />
            <TimelineStep
              number="Phase 3"
              title="Analytics Engine"
              description="Implement real-time analytics, reporting, and visualization tools for administrators"
            />
            <TimelineStep
              number="Phase 4"
              title="Pilot & Testing"
              description="Launch pilot in a selected community, gather feedback, and iterate on features"
            />
            <TimelineStep
              number="Phase 5"
              title="Scale & Expand"
              description="Roll out city-wide and extend to new markets with localized features"
            />
          </div>
        </Section>

        {/* Technology Stack */}
        <Section title="Technology Stack" className="pw-tech-section">
          <div className="pw-tech-grid">
            <div className="pw-tech-card">
              <h4>Frontend</h4>
              <p>React.js, React Router, Responsive Design</p>
            </div>
            <div className="pw-tech-card">
              <h4>Backend</h4>
              <p>Node.js/Express, RESTful APIs, Authentication</p>
            </div>
            <div className="pw-tech-card">
              <h4>Database</h4>
              <p>MongoDB/PostgreSQL, Real-time Data Sync</p>
            </div>
            <div className="pw-tech-card">
              <h4>Location Services</h4>
              <p>GPS Integration, Mapping APIs, Route Optimization</p>
            </div>
            <div className="pw-tech-card">
              <h4>Real-Time Features</h4>
              <p>WebSockets, Push Notifications, Live Tracking</p>
            </div>
            <div className="pw-tech-card">
              <h4>Analytics</h4>
              <p>Data Visualization, Charts, Business Intelligence</p>
            </div>
          </div>
        </Section>

        {/* Project Vision */}
        <Section title="Project Vision" className="pw-vision-section">
          <div className="pw-vision-card">
            <h3>Building a Cleaner, Smarter Future</h3>
            <p>
              The Smart Waste Management System envisions a world where waste collection is no longer 
              a challenge but an opportunity for innovation. Through digital transformation, we create 
              a sustainable ecosystem where:
            </p>
            <ul className="pw-vision-points">
              <li>Communities are cleaner and healthier</li>
              <li>Waste management is transparent and efficient</li>
              <li>Environmental impact is measurably reduced</li>
              <li>Citizens actively participate in sustainability</li>
              <li>Data empowers smarter, greener decisions</li>
            </ul>
          </div>
        </Section>

        {/* Success Metrics */}
        <Section title="Key Success Metrics" className="pw-metrics-section">
          <div className="pw-metrics-grid">
            <div className="pw-metric">
              <div className="pw-metric-value">80%</div>
              <div className="pw-metric-label">Reduction in Response Time</div>
            </div>
            <div className="pw-metric">
              <div className="pw-metric-value">60%</div>
              <div className="pw-metric-label">Decrease in Illegal Dumping</div>
            </div>
            <div className="pw-metric">
              <div className="pw-metric-value">45%</div>
              <div className="pw-metric-label">Lower Fuel Consumption</div>
            </div>
            <div className="pw-metric">
              <div className="pw-metric-value">95%</div>
              <div className="pw-metric-label">System Uptime & Reliability</div>
            </div>
            <div className="pw-metric">
              <div className="pw-metric-value">10K+</div>
              <div className="pw-metric-label">Expected Active Users</div>
            </div>
            <div className="pw-metric">
              <div className="pw-metric-value">99%</div>
              <div className="pw-metric-label">User Satisfaction Rate</div>
            </div>
          </div>
        </Section>

        {/* Call to Action */}
        <Section title="Join the Waste Management Revolution" className="pw-cta-section">
          <div className="pw-final-cta">
            <p>
              Transform your community's waste management with Smart Waste Management System. 
              Experience real-time coordination, reduced costs, and a cleaner environment.
            </p>
            <div className="pw-cta-buttons">
              <button className="pw-btn-primary pw-btn-lg">Request Live Demo</button>
              <button className="pw-btn-outline pw-btn-lg">Download Pitch Deck (PDF)</button>
              <button className="pw-btn-outline pw-btn-lg">Contact Sales</button>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="pw-footer">
        <div className="pw-footer-content">
          <div className="pw-footer-section">
            <h4>Smart Waste Management System</h4>
            <p>Building sustainable communities through digital innovation</p>
          </div>
          <div className="pw-footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
            </ul>
          </div>
          <div className="pw-footer-section">
            <h4>Contact</h4>
            <p>Email: info@smartwaste.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="pw-footer-bottom">
          <p>© 2024 Smart Waste Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
