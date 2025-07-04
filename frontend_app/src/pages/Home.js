import React, { useState, useEffect } from 'react';
import GlassyCard from '../components/GlassyCard';

/**
 * PUBLIC_INTERFACE
 * Home page: dreamy pastel intro, gentle onboarding, daily affirmation,
 * navigation card grid (Room, Journal, Music, Shop, Profile), and a floating mood emoji bubble.
 * Uses GlassyCard, ethereal layout, soft animations.
 */
const NAV_CARDS = [
  {
    label: "My Room",
    emoji: "🏡",
    description: "Decorate, interact and express your mood",
    path: "/room",
    accentColor: "#caaaff",
  },
  {
    label: "Journal",
    emoji: "📓",
    description: "Reflect with gentle prompts, mood tags, and writing",
    path: "/journal",
    accentColor: "#ffabd2",
  },
  {
    label: "Music",
    emoji: "🎶",
    description: "Curate lo-fi playlists by mood & aesthetic",
    path: "/music",
    accentColor: "#c3c2f3",
  },
  {
    label: "Shop",
    emoji: "🌟",
    description: "Unlock magical decor, outfits & gifts for your room",
    path: "/shop",
    accentColor: "#ffeaf4",
  },
  {
    label: "Profile",
    emoji: "🦄",
    description: "Set your name, pronouns, dreams & mood aesthetic",
    path: "/profile",
    accentColor: "#b477e0",
  },
];

const AFFIRMATIONS = [
  "Your feelings are welcomed—every color, every cloud.",
  "You are worthy of rest and gentle joy.",
  "No thought is too small to be celebrated.",
  "Today you are blossoming, in your own perfect way.",
  "Softness is strength. You are safe here.",
  "The universe celebrates you for just being.",
  "Magic happens when you honor your own heart.",
];

function getRandomAffirmation() {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
}

const MOOD_EMOJIS = [
  "😊", "🥹", "🥰", "😌", "😴", "🫧", "✨", "☁️", "💖"
];

function getRandomEmoji() {
  return MOOD_EMOJIS[Math.floor(Math.random() * MOOD_EMOJIS.length)];
}

function Home() {
  const [affirmation, setAffirmation] = useState(getRandomAffirmation());
  const [bubbleEmoji, setBubbleEmoji] = useState(getRandomEmoji());

  // Change emoji gently every ~7s for more vibes
  useEffect(() => {
    const moodInterval = setInterval(() => {
      setBubbleEmoji(getRandomEmoji());
    }, 7000);
    return () => clearInterval(moodInterval);
  }, []);

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 1
    }}>
      {/* Dreamy floating intro header */}
      <header
        style={{
          marginTop: 56,
          textAlign: "center",
          padding: "2.1rem 1rem 0.8rem 1rem",
          maxWidth: 630,
          width: "100%",
          background: "rgba(255,255,255,0.29)",
          borderRadius: 34,
          boxShadow: "0 6px 44px 0 rgba(202,170,255,0.19)",
          backdropFilter: "blur(17px)",
          position: "relative"
        }}
      >
        <h1 className="dreamy-accent-text" style={{
          fontFamily: "Baloo 2, Comic Sans MS, Helvetica Neue, Arial, cursive, sans-serif",
          fontWeight: 700,
          fontSize: "2.8rem",
          letterSpacing: "-0.018em",
          marginBottom: "0.2em"
        }}>
          pastel dreamscape
        </h1>
        <h2 style={{
          color: "#ffabd2",
          fontWeight: 500,
          fontSize: "1.3rem",
          marginTop: 0,
          letterSpacing: 0.02,
        }}>
          a soft universe for celebrating every feeling ☁️✨
        </h2>
        <p style={{
          fontSize: "1.12rem",
          color: "#896baf",
          marginTop: "1.3em",
          marginBottom: "0.8em",
          fontFamily: "Quicksand, Baloo 2, Comic Sans MS, cursive, Arial",
          fontWeight: 400,
        }}>
          Welcome to your magical self-care space! Float, decorate, journal, listen, collect, and express your soul in clouds of pastel validation.<br />
          🌈 Choose a dreamy card to begin your journey.
        </p>
      </header>

      {/* Daily affirmation/soft prompt */}
      <GlassyCard
        accentColor="#ffabd2"
        style={{
          marginTop: -18,
          marginBottom: 26,
          padding: "1.21rem 1.3rem",
          maxWidth: 410,
        }}
      >
        <div style={{
          fontFamily: "Baloo 2, Comic Sans MS, cursive",
          fontSize: "1.13rem",
          color: "#ab85ca",
          fontWeight: 600,
          textShadow: "0 2px 18px #ffeaf455"
        }}>
          <span role="img" aria-label="affirmation" style={{ fontSize: "1.4em", marginRight: 9 }}>💫</span>
          <em>{affirmation}</em>
        </div>
        <button
          aria-label="New affirmation"
          onClick={() => setAffirmation(getRandomAffirmation())}
          style={{
            marginTop: 14,
            background: "rgba(255,255,255,0.18)",
            border: "none",
            color: "#caaaff",
            fontWeight: 500,
            borderRadius: 16,
            fontSize: "1rem",
            padding: "0.15em 1.03em",
            cursor: "pointer",
            boxShadow: "0 3px 18px 0 #ffeaf444",
            transition: "background .17s, color .17s",
          }}
        >🌸 new affirmation</button>
      </GlassyCard>

      {/* Main grid of navigation GlassyCards */}
      <div
        className="dreamy-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: "1.5rem 1.2rem",
          width: "100%",
          maxWidth: 890,
          margin: "0 auto",
          marginBottom: 50,
          justifyItems: "center",
        }}
      >
        {NAV_CARDS.map(nav => (
          <GlassyCard
            key={nav.label}
            accentColor={nav.accentColor}
            className="dreamy-nav-card"
            style={{
              minHeight: 146,
              padding: "1.8rem 1.05rem",
              cursor: "pointer",
              width: "100%",
              maxWidth: 260,
              textAlign: "center",
              opacity: 0.98,
              boxShadow: "0 8px 32px 0 rgba(202,170,255,0.18)",
              transition: "transform .13s, box-shadow .13s",
            }}
          >
            <a
              href={nav.path}
              style={{
                textDecoration: "none",
                color: "#b477e0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: 98,
              }}
            >
              <span style={{
                fontSize: "2.1rem",
                marginBottom: 5,
                filter: "drop-shadow(0 1px 8px #caaaff55)"
              }}>
                {nav.emoji}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontFamily: "Baloo 2, Quicksand, cursive, Arial",
                  fontSize: "1.23rem",
                  color: nav.accentColor,
                  marginBottom: 1,
                  letterSpacing: "0.014em",
                  textShadow: "0 4px 13px #ffeaf455"
                }}
              >
                {nav.label}
              </span>
              <span
                style={{
                  fontWeight: 450,
                  fontFamily: "Quicksand, Arial, sans-serif",
                  color: "#8e77b6",
                  fontSize: "0.97rem",
                  lineHeight: 1.3,
                  marginTop: 3,
                }}
              >{nav.description}</span>
            </a>
          </GlassyCard>
        ))}
      </div>

      {/* Floating mood emoji bubble */}
      <div
        className="floating-emoji-bubble"
        style={{
          position: "fixed",
          right: 40,
          top: "41vh",
          zIndex: 32,
          pointerEvents: "none",
          background: "radial-gradient(circle at 63% 36%, #ffeaf4bb 55%, #caaaff77 100%)",
          borderRadius: "50%",
          width: 64,
          height: 64,
          boxShadow: "0 8px 36px 0 #ffabd25c, 0 2px 22px #caaaff55",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "floatBubble 9s ease-in-out infinite alternate",
          filter: "blur(0.1px) contrast(1.03) brightness(1.07)",
          transition: "background .18s",
        }}
        aria-label="Current dreamy mood"
      >
        <span
          style={{
            fontSize: "2.55rem",
            filter: "drop-shadow(0 2px 12px #ffabd299)",
            userSelect: "none"
          }}
          role="img"
        >
          {bubbleEmoji}
        </span>
      </div>
      {/* Floating bubble animation */}
      <style>
        {`
        @keyframes floatBubble {
          0% { transform: translateY(-6px) scale(1); }
          70% { transform: translateY(18px) scale(1.13) rotate(4deg);}
          100% { transform: translateY(-8px) scale(1); }
        }
        @media (max-width: 768px) {
          .floating-emoji-bubble {
            right: 10px !important;
            top: 67vh !important;
            width: 48px !important;
            height: 48px !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Home;
