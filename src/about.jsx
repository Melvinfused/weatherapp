import React from 'react';
import "./about.css";

const AboutCard = () => {

  return (
<div className="about-overlay">
  <div className="about-card">
    <h2 className="about-header">Weather</h2>
    <p className="about-paragraph">
      Ah, so thou hast found this Weather App, and perchance thou art wondering, “What makes this so special?” Well, let me tell thee. ‘Tis quick, ‘tis sleek, and gives thee only what thou needest—no nonsense, no distractions. It is the app thou deservest, though thou may not realise it yet... but trust me, thou most certainly need it!
    </p>
    <p className="about-paragraph">
      Just a weather app with a bit more rizz.
    </p>
    <div className="about-footer">
      <p>Crafted with far too much free time, <br />faith & a GPT 4o by Melvin Francy</p>
    </div>
  </div>
</div>
  );
};

export default AboutCard;
