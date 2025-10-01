import React, { useState, useEffect } from "react";
import AboutCard from "./about.jsx";
import Header from "./Header.jsx";
import GlowingWorldMap from "./bg1.jsx";
import WeatherInfoCard from "./infocard.jsx";

const App = () => {
  const [currentComponent, setCurrentComponent] = useState("home");

  // Function to handle header clicks
  const handleLinkClick = (section) => {
    setCurrentComponent(section);
  };

  // Swipe detection
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };

    const handleSwipeGesture = () => {
      if (touchEndX - touchStartX > 50) {
        // Swiped right
        setCurrentComponent("about");
      } else if (touchStartX - touchEndX > 50) {
        // Swiped left
        setCurrentComponent("home");
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div>
      <Header onLinkClick={handleLinkClick} />
      <GlowingWorldMap />

      {currentComponent === "home" && <WeatherInfoCard />}
      {currentComponent === "about" && <AboutCard />}
    </div>
  );
};

export default App;
