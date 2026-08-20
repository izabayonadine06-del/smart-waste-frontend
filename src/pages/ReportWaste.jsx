import React, { useState } from 'react';
import { Modal, Alert, LoadingSpinner } from '../components/UIComponents';
import * as wasteService from '../services/wasteService';
import '../styles/dashboard.css';

const ReportWaste = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'organic',
    priority: 'normal',
    address: '',
    latitude: null,
    longitude: null,
    imageUrl: '',
    estimatedWeight: '',
  });

  const categories = [
    { value: 'organic', label: '🌿 Organic Waste', description: 'Food scraps, yard waste' },
    { value: 'plastic', label: '🔵 Plastic', description: 'Bottles, bags, packaging' },
    { value: 'metal', label: '🟡 Metal', description: 'Cans, scrap metal' },
    { value: 'paper', label: '📄 Paper', description: 'Cardboard, newspapers' },
    { value: 'hazardous', label: '⚠️ Hazardous', description: 'Chemicals, batteries' },
    { value: 'mixed', label: '🗑️ Mixed Waste', description: 'Various types' },
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
          setLoading(false);
        },
        (error) => {
          setError('Failed to get location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const reportData = {
        ...formData,
        userId: localStorage.getItem('userId') || '1',
        createdAt: new Date(),
        status: 'pending',
      };

      await wasteService.createReport(reportData);
      setSuccess('Waste report submitted successfully! Our team will review it shortly.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'organic',
        priority: 'normal',
        address: '',
        latitude: null,
        longitude: null,
        imageUrl: '',
        estimatedWeight: '',
      });
      setStep(1);

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-waste-page">
      <div className="dashboard-header">
        <h1>📝 Report Waste Collection</h1>
        <p>Help us keep the environment clean by reporting waste</p>
      </div>

      {error && (
        <Alert
          type="danger"
          title="Error"
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

      <div className="report-container">
        <div className="report-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span>1</span>
            <p>Waste Type</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span>2</span>
            <p>Details</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Location</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Step 1: Category */}
          {step === 1 && (
            <div className="form-step">
              <h3>Select Waste Category</h3>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-card ${formData.category === cat.value ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                  >
                    <p className="category-icon">{cat.label.split(' ')[0]}</p>
                    <p className="category-name">{cat.label}</p>
                    <p className="category-desc">{cat.description}</p>
                  </button>
                ))}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="form-step">
              <h3>Report Details</h3>

              <div className="form-group">
                <label>Report Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Garbage pile at park entrance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Provide detailed information about the waste..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="normal">🟡 Normal</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Photo (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="file-label">
                    📸 Click to upload or drag and drop
                  </label>
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="form-step">
              <h3>Waste Location</h3>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  placeholder="Enter the exact location or address where the waste is located"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows="3"
                />
              </div>

              <div className="location-button">
                <button type="button" className="btn btn-secondary" onClick={handleGetLocation}>
                  📍 Use My Current Location
                </button>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="location-info">
                  <p><strong>✓ Location captured:</strong></p>
                  <p>Latitude: {formData.latitude.toFixed(6)}</p>
                  <p>Longitude: {formData.longitude.toFixed(6)}</p>
                </div>
              )}

              <div className="report-summary">
                <h4>📋 Report Summary</h4>
                <div className="summary-item">
                  <span>Category:</span>
                  <strong>{formData.category}</strong>
                </div>
                <div className="summary-item">
                  <span>Priority:</span>
                  <strong>{formData.priority}</strong>
                </div>
                <div className="summary-item">
                  <span>Title:</span>
                  <strong>{formData.title}</strong>
                </div>
                <div className="summary-item">
                  <span>Location:</span>
                  <strong>{formData.address}</strong>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : '✓ Submit Report'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .report-waste-page {
          padding: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        .report-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .report-steps {
          display: flex;
          justify-content: space-around;
          padding: 30px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          border-bottom: 2px solid #ecf0f1;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step span {
          width: 40px;
          height: 40px;
          background: #ecf0f1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #95a5a6;
          transition: all 0.3s ease;
        }

        .step p {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          color: #95a5a6;
          text-transform: uppercase;
        }

        .step.active span {
          background: #2ecc71;
          color: white;
        }

        .step.active p {
          color: #2ecc71;
        }

        .step.completed span {
          background: #2ecc71;
          color: white;
        }

        .step.completed span::after {
          content: '✓';
        }

        .step.completed span {
          font-size: 0;
        }

        .report-form {
          padding: 40px;
        }

        .form-step h3 {
          margin: 0 0 30px 0;
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .category-card {
          padding: 20px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .category-card:hover {
          border-color: #2ecc71;
          box-shadow: 0 6px 12px rgba(46, 204, 113, 0.2);
          transform: translateY(-4px);
        }

        .category-card.active {
          border-color: #2ecc71;
          background: #f0fdf4;
          box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
        }

        .category-icon {
          font-size: 28px;
          margin: 0 0 10px 0;
        }

        .category-name {
          margin: 0 0 5px 0;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .category-desc {
          margin: 0;
          font-size: 12px;
          color: #95a5a6;
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
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .file-upload {
          border: 2px dashed #ecf0f1;
          border-radius: 6px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .file-upload:hover {
          border-color: #2ecc71;
          background-color: #f0fdf4;
        }

        .file-upload input {
          display: none;
        }

        .file-label {
          display: block;
          cursor: pointer;
          color: #5a6c7d;
        }

        .image-preview {
          margin-top: 15px;
          max-height: 300px;
          overflow: hidden;
          border-radius: 6px;
        }

        .image-preview img {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
        }

        .location-button {
          margin-bottom: 20px;
        }

        .location-info {
          background-color: #f0fdf4;
          border: 1px solid #2ecc71;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 13px;
        }

        .location-info p {
          margin: 5px 0;
          font-family: monospace;
        }

        .report-summary {
          background-color: #f9fafb;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 30px;
        }

        .report-summary h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 14px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ecf0f1;
          font-size: 13px;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item span {
          color: #95a5a6;
          font-weight: 500;
        }

        .summary-item strong {
          color: #2c3e50;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .form-actions .btn {
          min-width: 150px;
        }

        @media (max-width: 768px) {
          .report-waste-page {
            padding: 10px;
          }

          .report-form {
            padding: 20px;
          }

          .report-steps {
            padding: 20px 10px;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportWaste;
