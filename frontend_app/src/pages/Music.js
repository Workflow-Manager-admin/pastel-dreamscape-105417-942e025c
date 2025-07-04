import React, { useState } from 'react';

// Dreamy, pastel mood/color/aesthetic quiz options
const MOOD_OPTIONS = [
  { label: "Dreamy", color: "#caaaff", emoji: "🫧", vibe: "dreamy" },
  { label: "Soft/Sad", color: "#ffabd2", emoji: "🥹", vibe: "sad" },
  { label: "Chill", color: "#b477e0", emoji: "😌", vibe: "chill" },
  { label: "Cloudy", color: "#ffeaf4", emoji: "☁️", vibe: "cloud" },
  { label: "Magical", color: "#ab85ca", emoji: "✨", vibe: "magical" }
];
const COLOR_OPTIONS = [
  { label: "Lavender", color: "#caaaff", emoji: "💜", keyword: "lavender" },
  { label: "Rose Quartz", color: "#ffabd2", emoji: "🩰", keyword: "rose" },
  { label: "Sky Blue", color: "#aee7fd", emoji: "💙", keyword: "sky" },
  { label: "Buttercup", color: "#fef6b5", emoji: "💛", keyword: "butter" },
  { label: "Mint", color: "#c6ffe6", emoji: "💚", keyword: "mint" }
];
const AESTHETIC_OPTIONS = [
  { label: "Lofi", emoji: "🎧", keyword: "lofi" },
  { label: "Dream Pop", emoji: "☁️", keyword: "dreampop" },
  { label: "Indie", emoji: "🦋", keyword: "indie" },
  { label: "Ambient", emoji: "🌙", keyword: "ambient" },
  { label: "Hyperpop", emoji: "💫", keyword: "hyperpop" }
];

// Mocked mapping from quiz answers to Spotify playlist embed ids
const SPOTIFY_PLAYLISTS = [
  // dreamy + lavender + dreampop
  { key: "dreamy|lavender|dreampop", playlistId: "4uLU6hMCjMI75M1A2tKUQC" }, // Replace with actual playlist ids
  { key: "chill|sky|lofi", playlistId: "37i9dQZF1DXcCnTAt8CfNe" },
  { key: "sad|rose|ambient", playlistId: "37i9dQZF1DWVpjAJGB70vU" },
  { key: "magical|butter|hyperpop", playlistId: "1h0CEZCm6IbFTbxThn6Xcs" },
  { key: "cloud|mint|indie", playlistId: "37i9dQZF1DWWEJlAGA9gs0" },
];

// Helper to pick playlist id based on quiz state
function getPlaylistId(mood, color, aesthetic) {
  const match = SPOTIFY_PLAYLISTS.find(
    (p) => p.key === `${mood}|${color}|${aesthetic}`
  );
  // fallback to something gentle and pastel if not perfect match
  if (match) return match.playlistId;
  if (mood === "dreamy") return "4uLU6hMCjMI75M1A2tKUQC";
  if (mood === "chill" || aesthetic === "lofi") return "37i9dQZF1DXcCnTAt8CfNe";
  if (mood === "soft/sad") return "37i9dQZF1DWVpjAJGB70vU";
  if (aesthetic === "ambient") return "37i9dQZF1DWWEJlAGA9gs0";
  return "4uLU6hMCjMI75M1A2tKUQC"; // dreamy fallback
}

// PUBLIC_INTERFACE
/**
 * Music page: dreamy glassy music bar with mood/color/aesthetic quiz,
 * fetches curated Spotify embeds, dreamy pastel glass styling.
 */
function Music() {
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState({
    mood: null,
    color: null,
    aesthetic: null,
  });

  // When all quiz answers, display player
  const allAnswered = quiz.mood && quiz.color && quiz.aesthetic;
  const playlistId = allAnswered
    ? getPlaylistId(quiz.mood, quiz.color, quiz.aesthetic)
    : null;

  // Dreamy, glassy animated style helpers
  function GlassyPanel({ children, style = {} }) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.37)",
          borderRadius: 40,
          boxShadow:
            "0 12px 36px 0 rgba(202,170,255,0.23), 0 4px 22px #ffabd278",
          border: "2.3px solid #caaaff55",
          padding: "2.6rem 2.0rem 2.8rem 2.0rem",
          maxWidth: 430,
          margin: "32px auto",
          backdropFilter: "blur(25px)",
          position: "relative",
          ...style,
        }}
      >
        <div className="card-sparkles" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span key={i} className={`card-sparkle sparkle-${i % 3}`}></span>
          ))}
        </div>
        {children}
      </div>
    );
  }

  // Step labels
  const steps = [
    "How are you feeling?",
    "Pick a dreamy color",
    "Pick an aesthetic",
  ];

  // Emoji animation for music energy
  function AnimatedEmojiBubble({ emoji = "🎶", color = "#b477e0" }) {
    return (
      <div
        className="floating-emoji-bubble"
        style={{
          position: "fixed",
          right: 40,
          top: "23vh",
          zIndex: 27,
          pointerEvents: "none",
          background: "radial-gradient(circle at 63% 36%, #ffeaf488 55%, #caaaff77 100%)",
          borderRadius: "50%",
          width: 68,
          height: 68,
          boxShadow: "0 8px 32px 0 #ffabd244, 0 2px 22px #caaaff55",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "floatBubble 9s ease-in-out infinite alternate",
          filter: "blur(0.04px) contrast(1.07) brightness(1.08)",
          transition: "background .18s",
        }}
        aria-label="Music vibe"
      >
        <span
          style={{
            fontSize: "2.65rem",
            filter: "drop-shadow(0 2px 12px #ffabd299)",
            userSelect: "none",
            color,
          }}
          role="img"
        >
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <section
      style={{
        padding: "2.5rem 0 3.8rem 0",
        background: "none",
        minHeight: "89vh",
        width: "100%",
        textAlign: "center",
        position: "relative",
        zIndex: 3,
      }}
    >
      <h1
        className="dreamy-accent-text"
        style={{
          fontWeight: 700,
          fontSize: "2.18rem",
          letterSpacing: "-.01em",
          marginBottom: 10,
        }}
      >
        Music Bar
      </h1>
      <span style={{ color: "#b477e0", fontWeight: 500, fontSize: 19 }}>
        Curated, dreamy Spotify playlists for every pastel mood.<br />
        <span style={{ fontSize: 16, color: "#ab85ca" }}>
          {`Take the quiz below for a gentle blend of vibes!`}
        </span>
      </span>

      {/* Quiz: Mood, Color, Aesthetic stepper */}
      <GlassyPanel style={{ marginTop: 32, marginBottom: 24, minHeight: 150 }}>
        <h2
          style={{
            color: "#ffabd2",
            fontWeight: 600,
            fontSize: "1.27rem",
            marginBottom: 8,
          }}
        >
          <span role="img" aria-label="quiz" style={{ fontSize: 19 }}>
            🌈
          </span>{" "}
          {steps[step]}
        </h2>
        {/* Step selectors */}
        {step === 0 && (
          <div
            style={{
              display: "flex",
              gap: 15,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.vibe}
                type="button"
                onClick={() => {
                  setQuiz({ ...quiz, mood: m.vibe });
                  setStep(1);
                }}
                className={
                  quiz.mood === m.vibe ? "dreamy-accent-text" : undefined
                }
                style={{
                  background:
                    quiz.mood === m.vibe
                      ? `${m.color}29`
                      : "rgba(255,255,255,.82)",
                  border:
                    quiz.mood === m.vibe
                      ? `2.1px solid ${m.color}`
                      : "2px solid #ffeaf4",
                  color: m.color,
                  fontWeight: quiz.mood === m.vibe ? 700 : 600,
                  fontSize: "1.12em",
                  borderRadius: 17,
                  padding: "8px 19px",
                  marginBottom: 6,
                  cursor: "pointer",
                  minWidth: 57,
                  outline: "none",
                  boxShadow:
                    quiz.mood === m.vibe
                      ? "0 2px 13px #ffabd233"
                      : "none",
                  transition: "background .15s, color .15s",
                }}
                aria-pressed={quiz.mood === m.vibe}
              >
                <span style={{ marginRight: 5, fontSize: 21 }}>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div
            style={{
              display: "flex",
              gap: 13,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.keyword}
                type="button"
                onClick={() => {
                  setQuiz({ ...quiz, color: c.keyword });
                  setStep(2);
                }}
                className={
                  quiz.color === c.keyword ? "dreamy-accent-text" : undefined
                }
                style={{
                  background:
                    quiz.color === c.keyword
                      ? `${c.color}29`
                      : "rgba(255,255,255,.71)",
                  border:
                    quiz.color === c.keyword
                      ? `2.1px solid ${c.color}`
                      : "2px solid #ffeaf4",
                  color: "#b477e0",
                  fontWeight: quiz.color === c.keyword ? 700 : 600,
                  fontSize: "1.01em",
                  borderRadius: 15,
                  padding: "8px 17px",
                  marginBottom: 6,
                  cursor: "pointer",
                  minWidth: 42,
                  outline: "none",
                  boxShadow:
                    quiz.color === c.keyword
                      ? "0 2px 13px #caaaff33"
                      : "none",
                  transition: "background .15s, color .15s",
                }}
                aria-pressed={quiz.color === c.keyword}
              >
                <span style={{ marginRight: 5, fontSize: 18 }}>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {AESTHETIC_OPTIONS.map((a) => (
              <button
                key={a.keyword}
                type="button"
                onClick={() => {
                  setQuiz({ ...quiz, aesthetic: a.keyword });
                  setStep(3);
                }}
                className={
                  quiz.aesthetic === a.keyword ? "dreamy-accent-text" : undefined
                }
                style={{
                  background:
                    quiz.aesthetic === a.keyword
                      ? "#caaaff2a"
                      : "rgba(255,255,255,.67)",
                  border:
                    quiz.aesthetic === a.keyword
                      ? "2.1px solid #caaaff"
                      : "2px solid #ffeaf4",
                  color: "#b477e0",
                  fontWeight: quiz.aesthetic === a.keyword ? 700 : 600,
                  fontSize: "1.01em",
                  borderRadius: 14,
                  padding: "8px 18px",
                  marginBottom: 6,
                  cursor: "pointer",
                  minWidth: 50,
                  outline: "none",
                  boxShadow:
                    quiz.aesthetic === a.keyword
                      ? "0 2px 11px #caaaff33"
                      : "none",
                  transition: "background .15s, color .15s",
                }}
                aria-pressed={quiz.aesthetic === a.keyword}
              >
                <span style={{ marginRight: 6, fontSize: 19 }}>{a.emoji}</span>
                {a.label}
              </button>
            ))}
          </div>
        )}
        {/* Stepper backward button (if not first) */}
        {step > 0 && step < 3 && (
          <button
            style={{
              marginTop: 16,
              background: "rgba(246,233,253,0.14)",
              border: "none",
              color: "#caaaff",
              fontWeight: 500,
              borderRadius: 19,
              fontSize: ".98em",
              padding: "0.01em 1.0em",
              cursor: "pointer",
              boxShadow: "0 2px 10px 0 #ffabd222",
              transition: "background .16s, color .16s",
              marginLeft: 11
            }}
            onClick={() => setStep(step - 1)}
            aria-label="Back"
          >
            ← Back
          </button>
        )}
        {/* All answered — reset button */}
        {step === 3 && (
          <div style={{ marginTop: 23 }}>
            <button
              onClick={() => {
                setQuiz({ mood: null, color: null, aesthetic: null });
                setStep(0);
              }}
              style={{
                background:
                  "linear-gradient(91deg,#ffabd229 49%, #caaaff15 100%)",
                color: "#b477e0",
                fontWeight: 700,
                fontSize: "1.08em",
                border: "none",
                borderRadius: 18,
                padding: "0.48em 1.6em",
                boxShadow: "0 2px 13px #caaaff16",
                cursor: "pointer",
                marginRight: 12,
              }}
            >
              🎨 Take quiz again
            </button>
            <span style={{ color: "#bcaede", fontSize: 13 }}>
              (pick new mood/vibes)
            </span>
          </div>
        )}
      </GlassyPanel>

      {/* Embeded Spotify player with dreamy glass accent */}
      {allAnswered && (
        <GlassyPanel style={{
          padding: "2.0rem 1.5rem 1.1rem 1.5rem",
          marginTop: 16,
          maxWidth: 545,
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: 16,
            fontWeight: 600,
            fontSize: "1.17em",
            color: "#b477e0",
            fontFamily: "Baloo 2, cursive"
          }}>
            <span style={{ fontSize: 22, marginRight: 9 }}>✨</span>
            Your curated pastel playlist:
          </div>
          <div
            className="dreamy-glassy-spotify"
            style={{
              borderRadius: 32,
              overflow: "hidden",
              background: "rgba(246,233,253,0.54)",
              boxShadow:
                "0 6px 23px 0 #caaaff24, 0 0px 16px #ffabd288",
              border: "2.3px solid #caaaff42",
              margin: "0 auto 0 auto",
              maxWidth: 452,
              minHeight: 95,
              backdropFilter: "blur(12px)"
            }}
          >
            {/* Spotify iframe */}
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="112"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              style={{
                border: "none",
                borderRadius: 28,
                minHeight: 92,
                maxHeight: 160,
                width: "100%",
                background:
                  "linear-gradient(90deg,#ffeaf4cc 16%,#caaaffbb 100%)",
                transition: "box-shadow .14s",
                boxShadow:
                  "0 8px 30px 0 rgba(202,170,255,0.12), 0 2px 14px #ffabd288"
              }}
              title="Dreamscape Music Bar"
              loading="lazy"
            ></iframe>
          </div>
          <div style={{ color: "#ffabd2", fontSize: 13.6, marginTop: 10 }}>
            Powered by Spotify. Playlist changes with your mood & color!
          </div>
        </GlassyPanel>
      )}

      {/* Dreamy, floating note for accessibility */}
      <AnimatedEmojiBubble
        emoji={
          quiz.mood === "magical"
            ? "✨"
            : quiz.mood === "cloud"
            ? "☁️"
            : quiz.mood === "dreamy"
            ? "🫧"
            : "🎶"
        }
        color={
          quiz.mood === "magical"
            ? "#ffabd2"
            : quiz.mood === "cloud"
            ? "#aee7fd"
            : quiz.mood === "dreamy"
            ? "#caaaff"
            : "#b477e0"
        }
      />

      {/* Soft floating keyframe styles */}
      <style>
        {`
        @keyframes floatBubble {
          0% { transform: translateY(-6px) scale(1); }
          70% { transform: translateY(18px) scale(1.13) rotate(4deg);}
          100% { transform: translateY(-8px) scale(1); }
        }
        `}
      </style>
    </section>
  );
}

export default Music;
