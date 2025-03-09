import React, { useState } from "react";
import AboutCard from "./about.jsx";
import Header from "./Header.jsx";
import GlowingWorldMap from "./bg1.jsx";
import WeatherInfoCard from "./infocard.jsx";

const App = () => {
  // State to track which component to render
  const [currentComponent, setCurrentComponent] = useState("home");

  // Function to handle the link clicks in the header
  const handleLinkClick = (section) => {
    setCurrentComponent(section);  // Change the state based on the section clicked
  };

  return (
    <div>
      <Header onLinkClick={handleLinkClick} />
      <GlowingWorldMap />
      
      {/* Conditionally render the components based on the state */}
      {currentComponent === "home" && <WeatherInfoCard />}
      {currentComponent === "about" && <AboutCard />}
    </div>
  );
};

export default App;
