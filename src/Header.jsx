import React from "react";
import "./Header.css"; // Import the CSS file for styling

const Header = ({ onLinkClick }) => {
  // Handle link clicks and pass the section to be displayed
  const handleLink = (event, section) => {
    event.preventDefault();  // Prevent default anchor link behaviour (scrolling)
    onLinkClick(section);     // Trigger the function passed from App.jsx
  };

  return (
    <header className="header">
      <h1 className="title">Weather</h1>
      <div className="notification-bar">
      <p>Currently in development, still working on gathering AQI & noise level information, Stay Tuned for updates with more useful features.</p>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#home" onClick={(event) => handleLink(event, "home")}>Home</a></li>
          <li><a href="#forecast">Forecasts</a></li>
          <li><a href="#alerts">Alerts</a></li>
          <li><a href="#about" onClick={(event) => handleLink(event, "about")}>About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
