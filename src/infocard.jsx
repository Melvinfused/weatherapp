import React, { useState, useEffect } from "react";

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
    
    const API_KEY = "a62d44e0f5f20c1ba7e454ec6350baf8";
    const AQI_API_KEY = "YOUR_WAQI_API_KEY";

    useEffect(() => {
        if (!location) return;
        
        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                
                if (response.ok) {
                    const lat = data.coord.lat;
                    const lon = data.coord.lon;
                    fetchAQI(lat, lon);
                    
                    setWeather(prev => ({
                        ...prev,
                        temp: data.main.temp + "°C",
                        description: data.weather[0].description,
                        humidity: data.main.humidity + "%",
                        windSpeed: data.wind.speed + " km/h",
                        pressure: data.main.pressure + " hPa",
                        visibility: (data.visibility / 1000).toFixed(1) + " km",
                    }));
                } else {
                    setWeather(prev => ({ ...prev, description: "Loc not found" }));
                }
            } catch (error) {
                console.error("Weather fetch error:", error);
            }
        };

        const fetchAQI = async (lat, lon) => {
            try {
                //const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=demo`);
                const data = await response.json();
                
                if (data.status === "ok") {
                    setWeather(prev => ({
                        ...prev,
                        aqi: "AQI "+ data.data.aqi,
                        noiseLevel: "-- dB" // Placeholder
                    }));
                }
            } catch (error) {
                console.error("AQI fetch error:", error);
            }
        };
        
        fetchWeather();
    }, [location]);

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <span style={styles.temperature}>{weather.temp}</span>
                    <span style={styles.climate}>| {weather.description}</span>
                    <div style={styles.locationContainer}>
                        <span style={styles.location}>⬤ </span>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            placeholder="Enter city, country" 
                            style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.table}>
                    <div style={styles.row}>
                        <div style={styles.cell}>⬤ Air Quality<br /><small>{weather.aqi}</small></div>
                        <div style={styles.cell}>⬤ Noise Level<br /><small>{weather.noiseLevel}</small></div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.cell}>⬤ Humidity<br /><small>{weather.humidity}</small></div>
                        <div style={styles.cell}>⬤ Wind Speed<br /><small>{weather.windSpeed}</small></div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.cell}>⬤ Pressure<br /><small>{weather.pressure}</small></div>
                        <div style={styles.cell}>⬤ Visibility<br /><small>{weather.visibility}</small></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        fontFamily: "Doto, sans-serif",
    },
    card: {
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
        width: "400px",
        textAlign: "center",
    },
    header: {
        fontSize: "26px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    temperature: {
        fontSize: "30px",
        fontWeight: "bold",
    },
    climate: {
        fontSize: "22px",
        fontWeight: "normal",
        marginLeft: "12px",
    },
    locationContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        marginTop: "10px",
    },
    location: {
        fontSize: "16px",
        fontWeight: "normal",
    },
    input: {
        padding: "5px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        background: "#222",
        color: "white",
        width: "180px",
        textAlign: "center",
    },
    table: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    row: {
        display: "flex",  
        justifyContent: "space-between",  
        alignItems: "center",  
        gap: "10px",  
        padding: "10px",
    },
    cell: {
        padding: "12px",
        borderRadius: "8px",
        background: "rgb(110 110 110 / 43%)",
        color: "#fff",
        textAlign: "center",
        minWidth: "140px",
        fontWeight: "bold",
    }
};

export default WeatherInfoCard;
