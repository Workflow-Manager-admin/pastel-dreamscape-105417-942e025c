import React, { useRef, useState } from "react";
import GlassyCard from "../components/GlassyCard";
import { getStored, setStored, usePersistedState } from "../utils/storage";

// Example list of ENOL drag-and-droppable decor assets (can be textured SVG/png or emoji stand-ins for MVP)
const ENOL_DECOR = [
  { id: "plant", label: "Pastel Plant", emoji: "🪴", defaultPos: { x: 60, y: 180 } },
  { id: "cloud", label: "Floating Cloud", emoji: "☁️", defaultPos: { x: 190, y: 80 } },
  { id: "heart", label: "Heart Accent", emoji: "💖", defaultPos: { x: 320, y: 220 } },
  { id: "star", label: "Star Sparkle", emoji: "✨", defaultPos: { x: 410, y: 120 } },
  { id: "lamp", label: "Cozy Lamp", emoji: "🛋️", defaultPos: { x: 160, y: 300 } }
];

// Example of available moods and avatars (minimal for MVP, can expand)
const MOODS = [
  { name: "Serene", emoji: "😌", color: "#caaaff" },
  { name: "Sleepy", emoji: "😴", color: "#ffabd2" },
  { name: "Excited", emoji: "🥳", color: "#ffeaf4" },
  { name: "Reflective", emoji: "🥹", color: "#b477e0" }
];
const AVATARS = [
  { id: "cat", label: "Cat", emoji: "🐱" },
  { id: "bunny", label: "Bunny", emoji: "🐰" },
  { id: "bear", label: "Bear", emoji: "🧸" }
];
const SCENTS = [
  { id: "lavender", label: "Lavender", emoji: "💐" },
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "candy", label: "Candy", emoji: "🍬" }
];

// Example pinned journal quotes
const DEFAULT_QUOTES = [
  "You are worthy of all the softness you crave.",
  "Let yourself bloom gently.",
  "Every mood gets a soft cloud to rest on.",
  "Validation is magic for the soul."
];

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
const ROOM_MIN_X = 0, ROOM_MIN_Y = 0, ROOM_MAX_X = 480, ROOM_MAX_Y = 350;

// KEYS for state persistence
const ROOM_KEY = "dreamscape-room-v1";
const ROOM_MOOD_KEY = "dreamscape-room-mood";
const ROOM_AVATAR_KEY = "dreamscape-room-avatar";
const ROOM_SCENT_KEY = "dreamscape-room-scent";
const ROOM_QUOTES_KEY = "dreamscape-room-pinned-quotes";
const ROOM_DECOR_KEY = "dreamscape-room-decor";
const ROOM_MODE_KEY = "dreamscape-room-mode";

// PUBLIC_INTERFACE
/**
 * My Room: dreamy, interactive "playground" for drag-decor, mood/avatar/scent mode, pin favorite quotes.
 * Persists state robustly to localStorage (or fallback).
 */
function Room() {
  // Robustly-persisted decor state
  const [decor, setDecor] = usePersistedState(
    ROOM_DECOR_KEY,
    ENOL_DECOR.map((d) => ({
      ...d,
      pos: d.defaultPos,
      isDragging: false,
      offset: { x: 0, y: 0 }
    }))
  );
  const roomRef = useRef();

  // Persisted mode, mood, avatar, scent, and pinned quotes
  const [mode, setMode] = usePersistedState(ROOM_MODE_KEY, "mood"); // "mood", "avatar", "scent"
  const [currentMood, setCurrentMood] = usePersistedState(ROOM_MOOD_KEY, MOODS[0]);
  const [currentAvatar, setCurrentAvatar] = usePersistedState(ROOM_AVATAR_KEY, AVATARS[0]);
  const [currentScent, setCurrentScent] = usePersistedState(ROOM_SCENT_KEY, SCENTS[0]);
  const [pinnedQuotes, setPinnedQuotes] = usePersistedState(ROOM_QUOTES_KEY, DEFAULT_QUOTES.slice(0, 2));

  // Input field for pinning new quotes
  const [newQuote, setNewQuote] = useState("");

  // --- Decor Drag ---
  const handleDragStart = (index, e) => {
    e.preventDefault();
    const decorItem = decor[index];
    const roomRect = roomRef.current.getBoundingClientRect();
    let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setDecor((prev) => {
      const upd = prev.map((d, i) =>
        i === index
          ? {
              ...d,
              isDragging: true,
              offset: {
                x: clientX - (roomRect.left + d.pos.x),
                y: clientY - (roomRect.top + d.pos.y)
              }
            }
          : d
      );
      setStored(ROOM_DECOR_KEY, upd);
      return upd;
    });
    document.body.style.cursor = "grabbing";
  };

  const handleDrag = (index, e) => {
    const d = decor[index];
    if (!d.isDragging) return;

    const roomRect = roomRef.current.getBoundingClientRect();
    let clientX, clientY;
    if (e.type.startsWith("touch")) {
      clientX = e.touches[0]?.clientX;
      clientY = e.touches[0]?.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    let newX = clamp(clientX - roomRect.left - d.offset.x, ROOM_MIN_X, ROOM_MAX_X);
    let newY = clamp(clientY - roomRect.top - d.offset.y, ROOM_MIN_Y, ROOM_MAX_Y);
    setDecor((prev) => {
      const upd = prev.map((obj, i) =>
        i === index ? { ...obj, pos: { x: newX, y: newY } } : obj
      );
      setStored(ROOM_DECOR_KEY, upd);
      return upd;
    });
  };

  const handleDragEnd = (index) => {
    setDecor((prev) => {
      const upd = prev.map((d, i) => (i === index ? { ...d, isDragging: false } : d));
      setStored(ROOM_DECOR_KEY, upd);
      return upd;
    });
    document.body.style.cursor = "auto";
  };

  // Mode & feature controls
  const modeButtons = [
    { key: "mood", label: "Mood", icon: "💞" },
    { key: "avatar", label: "Avatar", icon: "🧸" },
    { key: "scent", label: "Scent", icon: "🌸" }
  ];

  // Pin quote logic (persisted)
  function handlePinQuote() {
    if (newQuote.trim().length > 1) {
      setPinnedQuotes((q) => {
        const upd = [...q.slice(-2), newQuote.trim()];
        setStored(ROOM_QUOTES_KEY, upd);
        return upd;
      });
      setNewQuote("");
    }
  }
  function handleRemoveQuote(idx) {
    setPinnedQuotes((q) => {
      const upd = q.filter((_, i) => i !== idx);
      setStored(ROOM_QUOTES_KEY, upd);
      return upd;
    });
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h1
        className="dreamy-accent-text"
        style={{
          fontSize: "2.2rem",
          marginTop: 48,
          fontWeight: 800,
          textShadow: "0 2px 18px #ffabd266",
          letterSpacing: "-0.014em"
        }}
      >
        My Room
      </h1>
      <p style={{ color: "#8e77b6", fontWeight: 500, maxWidth: 420 }}>
        A pastel safe-space for your moods, avatar, decor, and favorite soft quotes.
      </p>

      {/* Main glassy room card ("desktop" for drag decor) */}
      <div
        ref={roomRef}
        style={{
          position: "relative",
          width: 520,
          height: 380,
          borderRadius: 34,
          background: "linear-gradient(120deg, #ffeaf4bb 33%, #caaaff88 100%)",
          boxShadow:
            "0 8px 52px 0 #ffabd222, 0 0px 16px #caaaff33, 0 0 0 12px rgba(255,255,255,0.01)",
          marginTop: 35,
          marginBottom: 21,
          overflow: "hidden"
        }}
        className="dreamy-card glassy-card"
      >
        {/* Floating drag-and-drop decor items */}
        {decor.map((item, i) => (
          <div
            key={item.id}
            className={`room-decor-item${item.isDragging ? " drag-active" : ""}`}
            style={{
              position: "absolute",
              left: item.pos.x,
              top: item.pos.y,
              fontSize: 40,
              zIndex: item.isDragging ? 35 : 8 + i,
              cursor: item.isDragging ? "grabbing" : "grab",
              userSelect: "none",
              filter: item.isDragging
                ? "drop-shadow(0 2px 16px #b477e088)"
                : "drop-shadow(0 0px 7px #ffabd244)",
              transition: item.isDragging ? "none" : "filter 0.2s"
            }}
            draggable={false}
            onMouseDown={(e) => handleDragStart(i, e)}
            onTouchStart={(e) => handleDragStart(i, e)}
            onMouseMove={
              item.isDragging
                ? (e) => {
                    e.preventDefault();
                    handleDrag(i, e);
                  }
                : null
            }
            onTouchMove={
              item.isDragging
                ? (e) => {
                    handleDrag(i, e);
                  }
                : null
            }
            onMouseUp={() => handleDragEnd(i)}
            onMouseLeave={() => handleDragEnd(i)}
            onTouchEnd={() => handleDragEnd(i)}
            tabIndex={0}
            aria-label={item.label}
            role="img"
          >
            {item.emoji}
          </div>
        ))}

        {/* Animated room sparkle layer (background decoration) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2
          }}
          aria-hidden="true"
        >
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${10 + (50 * i) % 440}px`,
                top: `${40 + (80 * i) % 340}px`,
                width: i % 3 === 2 ? 24 : 13 + (i % 2) * 8,
                height: i % 3 === 2 ? 24 : 13 + (i % 2) * 8,
                borderRadius: 30,
                background:
                  i % 3 === 2
                    ? "radial-gradient(circle,#ffabd244 70%,#ffeaf4bb 100%)"
                    : i % 2
                    ? "radial-gradient(circle,#caaaff77 80%,#ffeaf4bb 100%)"
                    : "radial-gradient(circle,#fff1 60%,#caaaff33 100%)",
                filter: "blur(1.3px) brightness(1.07)",
                opacity: 0.6,
                animation: `roomSparkleFloat 12s ${0.2 * i}s infinite alternate`
              }}
            />
          ))}
        </div>

        {/* Pin bar (floating right) for journal quotes */}
        <div
          style={{
            position: "absolute",
            right: 16,
            top: 20,
            width: 190,
            zIndex: 16,
            background: "rgba(255,255,255,0.67)",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 #caaaff33",
            padding: "0.8em 0.5em 0.8em 1em"
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "1.1em",
              color: "#caaaff",
              marginBottom: 8,
              letterSpacing: "0.02em"
            }}
          >
            📌 Pinned Quotes
          </div>
          {pinnedQuotes.map((quote, i) => (
            <div
              key={quote + i}
              style={{
                background: "#f8f1ff",
                borderRadius: 11,
                marginBottom: 7,
                color: "#896baf",
                fontSize: 14.6,
                padding: "5px 18px 5px 9px",
                position: "relative"
              }}
              className="dreamy-accent-text"
            >
              “{quote}”
              <button
                aria-label="Remove quote"
                onClick={() => handleRemoveQuote(i)}
                style={{
                  position: "absolute",
                  right: 4,
                  top: 2,
                  background: "none",
                  border: "none",
                  color: "#caaaff",
                  cursor: "pointer",
                  fontSize: 17
                }}
                tabIndex={0}
              >
                ×
              </button>
            </div>
          ))}
          <div style={{ marginTop: 6 }}>
            <input
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="Pin a new soft quote…"
              style={{
                borderRadius: 9,
                border: "1.7px solid #ffeaf4",
                padding: "3.8px 9px",
                width: "84%",
                fontSize: 13.6,
                marginRight: 2,
                marginBottom: 4
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePinQuote();
              }}
              aria-label="New quote"
              maxLength={120}
            />
            <button
              aria-label="Pin quote"
              onClick={handlePinQuote}
              style={{
                background: "linear-gradient(86deg, #caaaff88 33%, #ffabd247 100%)",
                color: "#fff",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                marginLeft: 1,
                cursor: "pointer"
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Mode controls (bottom left) */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 16,
            background: "rgba(246,233,253,0.88)",
            borderRadius: 18,
            boxShadow: "0 2px 14px 0 #caaaff34",
            padding: "0.6em 0.7em",
            display: "flex",
            alignItems: "center",
            gap: 7,
            zIndex: 18
          }}
        >
          {modeButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setMode(btn.key); setStored(ROOM_MODE_KEY, btn.key);
              }}
              className={mode === btn.key ? "dreamy-accent-text" : ""}
              style={{
                fontSize: 18,
                background: mode === btn.key
                  ? "linear-gradient(91deg,#ffabd226,#caaaff12 90%)"
                  : "transparent",
                border: "none",
                color: mode === btn.key ? "#b477e0" : "#b477e088",
                fontWeight: 700,
                borderRadius: 11,
                marginRight: 2,
                padding: "2px 13px",
                cursor: "pointer",
                boxShadow:
                  mode === btn.key
                    ? "0 2px 10px #caaaff22"
                    : "0 0px 2px transparent",
                transition: "background 0.18s,color 0.16s"
              }}
              aria-current={mode === btn.key ? "true" : undefined}
            >
              <span aria-hidden="true">{btn.icon}</span> {btn.label}
            </button>
          ))}
        </div>

        {/* Mode panel: display mood/ avatar/ scent selector as glassy panel up from bottom center */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: "54%",
            transform: "translateX(-54%)",
            zIndex: 30,
            minWidth: 230,
            maxWidth: 300,
            background: "rgba(255, 255, 255, 0.66)",
            borderRadius: 22,
            boxShadow: "0 3px 14px 0 #caaaff33",
            padding: "0.65em 1.2em 1.1em"
          }}
        >
          {mode === "mood" && (
            <div>
              <div style={{
                color: "#caaaff",
                fontWeight: 600,
                fontSize: 15.3,
                marginBottom: 7,
                letterSpacing: "0.01em"
              }}>Your Mood</div>
              <div style={{ display: "flex", gap: 17 }}>
                {MOODS.map((m) => (
                  <div
                    key={m.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setCurrentMood(m); setStored(ROOM_MOOD_KEY, m);
                    }}
                    style={{
                      background: currentMood.name === m.name
                        ? "linear-gradient(78deg,#caaaff5d 60%,#ffabd26b 100%)"
                        : "#f8f1ff",
                      border: currentMood.name === m.name
                        ? "2.3px solid #caaaff"
                        : "2.3px solid #ffeaf4",
                      boxShadow: currentMood.name === m.name
                        ? "0 2px 14px #ffabd234"
                        : undefined,
                      borderRadius: 13,
                      fontSize: 28,
                      cursor: "pointer",
                      padding: "4px 12px",
                      color: m.color,
                      marginBottom: 3,
                      outline: "none"
                    }}
                    aria-label={m.name}
                  >
                    {m.emoji}
                    <div style={{
                      fontSize: 13,
                      fontFamily: "Quicksand, Arial",
                      color: "#b477e0",
                      marginTop: 2,
                      fontWeight: 500
                    }}>{m.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mode === "avatar" && (
            <div>
              <div style={{
                color: "#ffabd2",
                fontWeight: 600,
                fontSize: 15.3,
                marginBottom: 7,
                letterSpacing: "0.01em"
              }}>Avatar</div>
              <div style={{ display: "flex", gap: 17 }}>
                {AVATARS.map((a) => (
                  <div
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setCurrentAvatar(a); setStored(ROOM_AVATAR_KEY, a);
                    }}
                    style={{
                      background: currentAvatar.id === a.id
                        ? "linear-gradient(78deg,#ffabd248 20%,#caaaff42 100%)"
                        : "#f8f1ff",
                      border: currentAvatar.id === a.id
                        ? "2.3px solid #ffabd2"
                        : "2.3px solid #ffeaf4",
                      boxShadow: currentAvatar.id === a.id
                        ? "0 2px 14px #ffabd244"
                        : undefined,
                      borderRadius: 13,
                      fontSize: 28,
                      cursor: "pointer",
                      padding: "4px 12px",
                      color: "#b477e0",
                      marginBottom: 3,
                      outline: "none"
                    }}
                    aria-label={a.label}
                  >
                    {a.emoji}
                    <div style={{
                      fontSize: 13,
                      fontFamily: "Quicksand, Arial",
                      color: "#ffabd2",
                      marginTop: 2,
                      fontWeight: 500
                    }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mode === "scent" && (
            <div>
              <div style={{
                color: "#b477e0",
                fontWeight: 600,
                fontSize: 15.3,
                marginBottom: 7,
                letterSpacing: "0.01em"
              }}>Ambience Scent</div>
              <div style={{ display: "flex", gap: 17 }}>
                {SCENTS.map((s) => (
                  <div
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setCurrentScent(s); setStored(ROOM_SCENT_KEY, s);
                    }}
                    style={{
                      background: currentScent.id === s.id
                        ? "linear-gradient(78deg,#ffeaf452 40%,#ffabd237 100%)"
                        : "#f8f1ff",
                      border: currentScent.id === s.id
                        ? "2.3px solid #b477e0"
                        : "2.3px solid #ffeaf4",
                      boxShadow: currentScent.id === s.id
                        ? "0 2px 14px #b477e044"
                        : undefined,
                      borderRadius: 13,
                      fontSize: 25,
                      cursor: "pointer",
                      padding: "4px 12px",
                      color: "#b477e0",
                      marginBottom: 3,
                      outline: "none"
                    }}
                    aria-label={s.label}
                  >
                    {s.emoji}
                    <div style={{
                      fontSize: 13,
                      fontFamily: "Quicksand, Arial",
                      color: "#b477e0",
                      marginTop: 2,
                      fontWeight: 500
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Central avatar + mood visual (animated) */}
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 150,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <span
            style={{
              fontSize: 64,
              filter: "drop-shadow(0 3px 16px #b477e044)"
            }}
            role="img"
            aria-label={currentAvatar.label}
          >
            {currentAvatar.emoji}
          </span>
          <span
            style={{
              fontSize: 28,
              color: currentMood.color,
              marginTop: -18,
              textShadow: "0 2px 10px #ffabd244",
              animation: "roomMoodPulse 4.2s ease-in-out infinite"
            }}
            role="img"
            aria-label={currentMood.name}
          >
            {currentMood.emoji}
          </span>
          <span
            style={{
              marginTop: 5,
              fontSize: 18,
              color: "#b477e0",
              fontWeight: 600,
              letterSpacing: "0.01em"
            }}
          >
            {currentMood.name}
          </span>
          <span
            style={{
              fontSize: 16,
              color: "#ffabd2",
              fontWeight: 500
            }}
          >
            {currentScent.label} {currentScent.emoji}
          </span>
        </div>
      </div>

      <GlassyCard
        accentColor="#caaaff"
        style={{
          marginTop: 0,
          maxWidth: 378,
          fontWeight: 500,
          lineHeight: 1.54,
          fontFamily: "Quicksand, Arial, cursive",
          color: "#896baf",
          fontSize: 17
        }}
      >
        Welcome to the interactive, dreamy "My Room" playground.<br />
        <strong>
          Drag and drop pastel ENOL decorations.<br />
          Switch your mood, avatar, or room scent below.<br />
          Pin your favorite daily quotes for vibes!
        </strong>
      </GlassyCard>
      {/* Soft animation styles for room */}
      <style>
        {`
        @keyframes roomSparkleFloat {
          0% { transform: translateY(0) scale(1.00); opacity: 0.7; }
          40% { opacity: 1; }
          70% { transform: translateY(13px) scale(1.1); opacity: 0.82; }
          100% { transform: translateY(-19px) scale(0.97); opacity: 0.35; }
        }
        @keyframes roomMoodPulse {
          0% { opacity: 1; transform: scale(1.0);}
          50% { opacity: 0.82; transform: scale(1.15);}
          100% { opacity: 1; transform: scale(1.0);}
        }
        /* Responsive styles */
        @media (max-width: 620px) {
          .dreamy-card.glassy-card {
            width: 99vw !important;
            max-width: 97vw !important;
            min-width: 98vw !important;
            height: 260px !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Room;
