import React from 'react';
import './overlays.css';

const AlertsOverlay = ({ location, alerts, loading, error, onClose }) => {
  return (
    <div className="custom-overlay" onClick={onClose}>
      <div className="custom-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-header">
          <div className="custom-title">Severe Weather Alerts</div>
          <div className="custom-location">{location || "Loading..."}</div>
        </div>

        {loading ? (
          <div className="status-container">
            <div className="spinner"></div>
            <div className="status-text">Checking for active weather alerts...</div>
          </div>
        ) : error ? (
          <div className="status-container">
            <div className="status-text" style={{ color: '#ff3333' }}>{error}</div>
          </div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="no-alerts">
            ⬤ No active severe alerts. Weather is safe.
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert, idx) => (
              <div 
                className={`alert-item severity-${alert.severity?.toLowerCase() || 'moderate'}`} 
                key={idx}
              >
                <div className="alert-event">
                  <span>{alert.event}</span>
                  <span className="alert-badge">{alert.severity}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
                  Coverage: {alert.area || location}
                </div>
                <div className="alert-desc">{alert.description}</div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={onClose} 
          style={{ 
            marginTop: '25px', 
            background: 'rgba(255,255,255,0.1)', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.2)',
            fontFamily: '"Doto", sans-serif',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertsOverlay;
