import React from 'react';
import "./about.css";

const AboutCard = () => {

  return (
<div className="about-overlay">
  <div className="about-card">
    <h2 className="about-header">Weather</h2>
    <p className="about-paragraph" style={{ fontFamily: '"Jacquard 24", system-ui',fontSize: "16px" }}>
    Ah, thou hast come upon this weather-telling instrument, and perchance thou dost wonder, ‘What maketh it so fine?’ Know this: it is swift, simple, and showeth thee only that which thou needest—no idle trifles, no vain matters. ‘Tis the very tool thou wert meant to have, though thou mayst not yet ken it… trust me, thou shalt find it most needful!    </p>
    <p className="about-paragraph" style={{ fontFamily: '"Jacquard 24", system-ui',fontSize: "16px" }}>
      Just a weather teller with a bit more rizz.
    </p>
    <div className="about-footer" style={{ fontFamily: '"Jacquard 24", system-ui',fontSize: "18px" }}>
      <p>Crafted with far too much free time, <br />faith & a GPT 4o by Melvin Francy</p>
    </div>
  </div>
</div>
  );
};

export default AboutCard;
