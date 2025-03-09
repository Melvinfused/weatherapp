import React from 'react';

const AboutCard = () => {
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
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    paragraph: {
      fontSize: "16px",
      color: "#aaa",
      lineHeight: "1.6",
      marginBottom: "20px",
    },
    footer: {
      fontSize: "14px",
      color: "cyan",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.header}>Weather</h2>
        <p style={styles.paragraph}>
          Ah, so thou hast found this Weather App, and perchance thou art wondering, “What makes this so special?” Well, let me tell thee. ‘Tis quick, ‘tis sleek, and gives thee only what thou needest—no nonsense, no distractions. It is the app thou deservest, though thou may not realise it yet... but trust me, thou most certainly need it!
        </p>
        <p style={styles.paragraph}>
          Just a weather app with a bit more rizz.
        </p>
        <div style={styles.footer}>
          <p>Crafted with far too much free time, <br />faith & a GPT 4o by Melvin Francy</p>
        </div>
      </div>
    </div>
  );
};

export default AboutCard;
