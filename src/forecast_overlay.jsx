import React from 'react';
import './overlays.css';

const ForecastOverlay = ({ location, forecast, loading, error, onClose }) => {
  return (
    <div className="custom-overlay" onClick={onClose}>
      <div className="custom-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-header">
          <div className="custom-title">5-Day Forecast</div>
          <div className="custom-location">{location || "Loading..."}</div>
        </div>

        {loading ? (
          <div className="status-container">
            <div className="spinner"></div>
            <div className="status-text">Fetching weather forecast...</div>
          </div>
        ) : error ? (
          <div className="status-container">
            <div className="status-text" style={{ color: '#ff3333' }}>{error}</div>
          </div>
        ) : !forecast || forecast.length === 0 ? (
          <div className="status-container">
            <div className="status-text">No forecast data available.</div>
          </div>
        ) : (
          <div className="forecast-list">
            {forecast.map((day, idx) => (
              <div className="forecast-row" key={idx}>
                <div className="forecast-date">{day.date}</div>
                <div className="forecast-weather">
                  {day.icon && (
                    <img
                      className="forecast-icon"
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                    />
                  )}
                  <span>{day.description}</span>
                </div>
                <div className="forecast-temp">
                  {day.tempMin} / {day.tempMax}
                </div>
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

export default ForecastOverlay;
