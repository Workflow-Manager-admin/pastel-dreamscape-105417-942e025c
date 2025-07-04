import React from 'react';

// PUBLIC_INTERFACE
function Home() {
  /**
   * Home page with a dreamy, pastel welcome to the emotional wellness app.
   * Features gentle introductory text and a soft visual vibe.
   */
  return (
    <section style={{
      padding: "4rem 1rem",
      textAlign: "center",
      background: "linear-gradient(180deg, #ffeaf4 0%, #caaaff 100%)",
      borderRadius: "24px",
      margin: "2rem auto",
      maxWidth: 700,
      boxShadow: "0 6px 32px 0 rgba(202,170,255,0.1)",
    }}>
      <h1 style={{
        fontFamily: "'Comic Sans MS', 'Comic Sans', cursive, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "2.5rem",
        color: "#caaaff",
        marginBottom: "0.2em"
      }}>
        pastel dreamscape
      </h1>
      <h2 style={{
        color: "#ffabd2",
        fontWeight: 400,
        fontSize: "1.4rem",
        marginTop: 0
      }}>
        a soft universe for celebrating every feeling ☁️✨
      </h2>
      <p style={{
        fontSize: "1.13rem",
        color: "#7c669c",
        marginTop: "1.3em"
      }}>
        Welcome to your magical self-care space. Float, decorate, journal, listen, collect, and express your soul in clouds of pastel validation. <br /> Choose a tab to begin your dreamy journey.
      </p>
    </section>
  );
}

export default Home;
