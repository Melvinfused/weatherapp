import React, { useState, useEffect } from "react";
import "./infocard.css";

const WeatherInfoCard = () => {
  const [location, setLocation] = useState("Kochi, IN");
  const [weather, setWeather] = useState({
    temp: "--",
    description: "Loading...",
    aqi: "--",
    noiseLevel: "--",
    humidity: "--",
    windSpeed: "--",
    pressure: "--",
    visibility: "--"
  });

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
          setWeather({
            temp: data.main.temp + "°C",
            description: data.weather[0].description,
            humidity: data.main.humidity + "%",
            windSpeed: data.wind.speed + " m/s",
            pressure: data.main.pressure + " hPa",
            visibility: (data.visibility / 1000).toFixed(1) + " km",
            aqi: "--",
            noiseLevel: "-- dB",
          });
        } else {
          setWeather(prev => ({ ...prev, description: "Location not found" }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();
  }, [location]);

  return (
    <div className="weather-overlay">
      <div className="weather-card">
       <div className="weather-header">
  <div className="temp-climate">
    <span className="temperature">{weather.temp}</span>
    <span className="climate"> {weather.description}</span>
  </div>
  <div className="location-container">
    <span className="location-dot">⬤</span>
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="Enter city, country"
      className="location-input"
    />
  </div>
</div>

        <div className="weather-table">
          <div className="weather-row">
            <div className="weather-cell">⬤ Air Quality<br /><small>{weather.aqi}</small></div>
            <div className="weather-cell">⬤ Noise Level<br /><small>{weather.noiseLevel}</small></div>
          </div>
          <div className="weather-row">
            <div className="weather-cell">⬤ Humidity<br /><small>{weather.humidity}</small></div>
            <div className="weather-cell">⬤ Wind Speed<br /><small>{weather.windSpeed}</small></div>
          </div>
          <div className="weather-row">
            <div className="weather-cell">⬤ Pressure<br /><small>{weather.pressure}</small></div>
            <div className="weather-cell">⬤ Visibility<br /><small>{weather.visibility}</small></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfoCard;
