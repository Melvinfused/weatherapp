import React, { useState, useEffect, useRef } from 'react';
import ForecastOverlay from './forecast_overlay';
import AlertsOverlay from './alerts_overlay';

const API_KEY = "a62d44e0f5f20c1ba7e454ec6350baf8"; // OpenWeatherMap API Key from .env

const processForecast = (forecastList) => {
  const dailyData = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  const dailyForecast = Object.keys(dailyData).map((date) => {
    const items = dailyData[date];
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    items.forEach((item) => {
      if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
    });

    const midDayItem = items.find((item) => item.dt_txt.includes("12:00:00")) || items[Math.floor(items.length / 2)];

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      tempMin: Math.round(minTemp) + "°C",
      tempMax: Math.round(maxTemp) + "°C",
      description: midDayItem.weather[0].description,
      icon: midDayItem.weather[0].icon,
    };
  });

  return dailyForecast.slice(0, 5);
};

const generateAlerts = async (weather, forecast, lat, lon) => {
  const alerts = [];
  const country = weather.sys?.country;
  const cityName = weather.name;

  // 1. US official severe weather alerts
  if (country === 'US') {
    try {
      const response = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
        headers: { 'User-Agent': 'WeatherAppPremium/1.0' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          data.features.forEach((feature) => {
            alerts.push({
              event: feature.properties.event,
              severity: feature.properties.severity || 'Moderate',
              description: feature.properties.description || feature.properties.headline || '',
              area: feature.properties.areaDesc || cityName
            });
          });
          return alerts;
        }
      }
    } catch (e) {
      console.error("NWS alerts fetch failed", e);
    }
  }

  // 2. Global Meteorological Alert Analyzer
  const currentTemp = weather.main?.temp;
  const currentWind = weather.wind?.speed;
  const currentDesc = weather.weather?.[0]?.description?.toLowerCase() || '';

  if (currentTemp >= 38) {
    alerts.push({
      event: 'Extreme Heat Advisory',
      severity: 'Severe',
      description: `Dangerously hot conditions with temperatures reaching ${currentTemp}°C. Limit outdoor activity and keep hydrated.`,
      area: `${cityName}, ${country}`
    });
  }

  if (currentTemp <= -5) {
    alerts.push({
      event: 'Extreme Cold Warning',
      severity: 'Severe',
      description: `Dangerously cold temperatures of ${currentTemp}°C. Dress in warm layers and protect exposed skin.`,
      area: `${cityName}, ${country}`
    });
  }

  if (currentDesc.includes('thunderstorm') || currentDesc.includes('heavy rain') || currentDesc.includes('squall') || currentDesc.includes('tornado') || currentDesc.includes('typhoon') || currentDesc.includes('hurricane')) {
    alerts.push({
      event: 'Severe Weather Warning',
      severity: 'Severe',
      description: `Active severe weather (${currentDesc}) reported. Seek indoor shelter and exercise precaution.`,
      area: `${cityName}, ${country}`
    });
  }

  if (currentWind >= 15) {
    alerts.push({
      event: 'High Wind Advisory',
      severity: 'Moderate',
      description: `Strong winds of ${currentWind} m/s active. Secure loose outdoor objects.`,
      area: `${cityName}, ${country}`
    });
  }

  if (currentDesc.includes('fog') && weather.visibility <= 1000) {
    alerts.push({
      event: 'Dense Fog Advisory',
      severity: 'Minor',
      description: `Visibilities below 1 km in dense fog. Drive with low beams and slow down.`,
      area: `${cityName}, ${country}`
    });
  }

  // 3. Air Pollution API for AQI alerts
  try {
    const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (aqiResponse.ok) {
      const aqiData = await aqiResponse.json();
      const aqiVal = aqiData.list?.[0]?.main?.aqi;
      if (aqiVal >= 4) {
        const severityStr = aqiVal === 5 ? 'Severe' : 'Moderate';
        const aqiNames = { 4: 'Poor AQI', 5: 'Very Poor AQI' };
        alerts.push({
          event: `Air Quality Alert (${aqiNames[aqiVal]})`,
          severity: severityStr,
          description: `The Air Quality Index (AQI) has reached an unhealthy level of ${aqiVal}. Sensitive groups should minimize outdoor tasks.`,
          area: `${cityName}, ${country}`
        });
      }
    }
  } catch (e) {
    console.error("AQI alert fetch failed", e);
  }

  return alerts;
};

// Bulletproof React input setter
const setReactInputValue = (inputEl, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(inputEl, 'value')?.set;
  const prototype = Object.getPrototypeOf(inputEl);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(inputEl, value);
  } else if (valueSetter) {
    valueSetter.call(inputEl, value);
  } else {
    inputEl.value = value;
  }
  
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  inputEl.dispatchEvent(new Event('change', { bubbles: true }));
};

const WeatherAppWrapper = ({ children }) => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [locationName, setLocationName] = useState("");
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aqiText, setAqiText] = useState("--");

  // Keep track of latest coordinates & location name
  const lastFetchedLocation = useRef("");

  // Setup geolocation on dot element
  useEffect(() => {
    const handleGeolocation = () => {
      const dot = document.querySelector('.location-dot');
      if (dot) {
        dot.classList.add('loading-geo');
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            if (response.ok) {
              const input = document.querySelector('.location-input');
              if (input) {
                setReactInputValue(input, `${data.name}, ${data.sys.country}`);
              }
            }
          } catch (e) {
            console.error(e);
          } finally {
            if (dot) dot.classList.remove('loading-geo');
          }
        },
        (err) => {
          console.error(err);
          alert("Could not access your location. Please check browser permissions.");
          if (dot) dot.classList.remove('loading-geo');
        }
      );
    };

    const setupDotObserver = () => {
      const dot = document.querySelector('.location-dot');
      if (dot && !dot.dataset.geoSetup) {
        dot.dataset.geoSetup = 'true';
        dot.innerHTML = '📍';
        dot.style.cursor = 'pointer';
        dot.title = 'Use device location';
        dot.onclick = handleGeolocation;
      }
    };

    const observer = new MutationObserver(() => {
      setupDotObserver();
      // Periodically force update AQI cell if standard React state overwrites it
      if (aqiText !== "--") {
        const cells = document.querySelectorAll('.weather-cell');
        cells.forEach((cell) => {
          if (cell.textContent.includes('Air Quality')) {
            const small = cell.querySelector('small');
            if (small && small.textContent !== aqiText) {
              small.textContent = aqiText;
            }
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setupDotObserver();

    return () => observer.disconnect();
  }, [aqiText]);

  // Intercept Navigation Links
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    const handleGlobalClick = (e) => {
      const anchor = e.target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#home' || href === '#about') {
          window.location.hash = '';
          setCurrentHash('');
        } else if (href === '#forecast') {
          window.location.hash = '#forecast';
          setCurrentHash('#forecast');
        } else if (href === '#alerts') {
          window.location.hash = '#alerts';
          setCurrentHash('#alerts');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Fetch forecast and alerts
  const fetchForecastAndAlerts = async (weatherData) => {
    const locationQuery = `${weatherData.name}, ${weatherData.sys.country}`;
    if (lastFetchedLocation.current === locationQuery) return;
    lastFetchedLocation.current = locationQuery;

    setLocationName(locationQuery);
    setLoading(true);
    setError(null);

    const { lat, lon } = weatherData.coord;

    try {
      // 1. Fetch Forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!forecastResponse.ok) throw new Error("Forecast failed to load");
      const forecastData = await forecastResponse.json();
      const processed = processForecast(forecastData.list);
      setForecast(processed);

      // 2. Fetch AQI and set label
      const aqiResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      let loadedAqiText = "--";
      if (aqiResponse.ok) {
        const aqiData = await aqiResponse.json();
        const aqiIndex = aqiData.list?.[0]?.main?.aqi;
        const aqiMap = {
          1: "1 (Good)",
          2: "2 (Fair)",
          3: "3 (Moderate)",
          4: "4 (Poor)",
          5: "5 (Very Poor)"
        };
        loadedAqiText = aqiMap[aqiIndex] || `${aqiIndex}`;
        setAqiText(loadedAqiText);
      }

      // 3. Fetch/Generate Alerts
      const generatedAlerts = await generateAlerts(weatherData, forecastData.list, lat, lon);
      setAlerts(generatedAlerts);

    } catch (e) {
      console.error(e);
      setError("Failed to fetch forecast & alerts data");
    } finally {
      setLoading(false);
    }
  };

  // Intercept openweathermap fetch
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      if (typeof url === 'string' && url.includes('api.openweathermap.org/data/2.5/weather')) {
        const res = await originalFetch(...args);
        const clone = res.clone();
        try {
          const data = await clone.json();
          if (data && data.coord) {
            fetchForecastAndAlerts(data);
          }
        } catch (e) {
          console.error("API response parsing failed", e);
        }
        return res;
      }
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      {children}
      {currentHash === '#forecast' && (
        <ForecastOverlay
          location={locationName}
          forecast={forecast}
          loading={loading}
          error={error}
          onClose={() => {
            window.location.hash = '';
            setCurrentHash('');
          }}
        />
      )}
      {currentHash === '#alerts' && (
        <AlertsOverlay
          location={locationName}
          alerts={alerts}
          loading={loading}
          error={error}
          onClose={() => {
            window.location.hash = '';
            setCurrentHash('');
          }}
        />
      )}
    </>
  );
};

export default WeatherAppWrapper;
