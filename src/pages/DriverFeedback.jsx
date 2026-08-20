import React, { useState } from 'react';
import '../styles/dashboard.css';

const DriverFeedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }

    if (!feedback.trim()) {
      alert('Please write your feedback.');
      return;
    }

    console.log({
      rating,
      feedback,
    });

    setSubmitted(true);
    setFeedback('');
    setRating(0);
  };

  return (
    <div className="page-content">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>💬 Driver Feedback</h1>
          <p>
            Share your experience and help us improve the Smart Waste
            Management System.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {submitted && (
        <div
          style={{
            background: '#eaf8ef',
            border: '1px solid #b7e4c7',
            color: '#187a3d',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          ✅ Thank you! Your feedback has been submitted successfully.
        </div>
      )}

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >

        {/* Feedback Form */}
        <div className="section">

          <div className="section-header">
            <h2>Send Feedback</h2>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Rating */}
            <div style={{ marginBottom: '25px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                How was your experience?
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '32px',
                }}
              >
                {[1, 2, 3, 4, 5].map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setRating(number)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '32px',
                      padding: '2px',
                      opacity: number <= rating ? 1 : 0.3,
                    }}
                    aria-label={`Rate ${number} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <small className="muted">
                  You selected {rating} out of 5 stars.
                </small>
              )}
            </div>

            {/* Feedback */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="feedback"
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Your Feedback
              </label>

              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                rows="7"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #dfe6e1',
                  borderRadius: '8px',
                  resize: 'vertical',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
              }}
            >
              🚀 Submit Feedback
            </button>

          </form>
        </div>

        {/* Information */}
        <div className="info-card">
          <h3>💡 Why your feedback matters</h3>

          <p style={{ fontSize: '14px', lineHeight: '1.7' }}>
            Your feedback helps administrators improve collection routes,
            driver assignments, communication, and the overall waste
            management service.
          </p>
        </div>

      </div>

    </div>
  );
};

export default DriverFeedback;