import React from 'react';

// PUBLIC_INTERFACE
function Music() {
  /**
   * Music page. Placeholder for music bar & Spotify recommendations.
   */
  return (
    <section style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "#b477e0" }}>Music</h1>
      <p>
        Mood-based music recommendations and quizzes.<br />
        (Soon: Choose your mood and discover gentle tracks, powered by Spotify API.)
      </p>
    </section>
  );
}

export default Music;
