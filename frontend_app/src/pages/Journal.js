import React, { useState, useEffect, useRef } from "react";
import GlassyCard from "../components/GlassyCard";

// --- Dreamy Gentle Prompts Pool ---
const SOFT_PROMPTS = [
  "How is your heart feeling today?",
  "What tiny joy or softness did you notice?",
  "What is a gentle wish you have for yourself right now?",
  "In one word, what describes this moment?",
  "Write a love letter to any of your emotions.",
  "Let your mind float—what do you need, truly?",
  "Celebrate a small success, no matter how quiet.",
  "Describe your mood as a pastel weather scene.",
  "What sparkle of hope would you like to collect today?",
  "Imagine your room reflects your feeling—what colors or objects appear?",
];

const MOOD_TAGS = [
  { label: "Loved", emoji: "💖", color: "#ffabd2"},
  { label: "Hopeful", emoji: "✨", color: "#ffeaf4"},
  { label: "Sleepy", emoji: "😴", color: "#b477e0"},
  { label: "Cloudy", emoji: "☁️", color: "#caaaff"},
  { label: "Grateful", emoji: "🙏", color: "#abf5c4"},
  { label: "Tender", emoji: "🥹", color: "#ffd6d6"},
  { label: "Dreamy", emoji: "🫧", color: "#caaaff"},
  { label: "Soft", emoji: "🧸", color: "#ffabd2"},
  { label: "Vibing", emoji: "🎶", color: "#ffeaf4"},
];

function getRandomPrompt() {
  return SOFT_PROMPTS[Math.floor(Math.random() * SOFT_PROMPTS.length)];
}

// Unlockable sparkles based on writing activity
const SPARKLE_THRESHOLDS = [
  { lines: 1, emoji: "✨", desc: "First Thought" },
  { lines: 3, emoji: "💫", desc: "Tiny Galaxy" },
  { lines: 6, emoji: "🌟", desc: "3-Entry Starlight" },
  { lines: 12, emoji: "🪐", desc: "Cosmic Bloom" },
];

// Helper: load/save from localStorage
const STORAGE_KEY = "dreamscape-journal-entries";

// PUBLIC_INTERFACE
/**
 * Journal page: free-writing diary w/ mood tagging, daily prompts,
 * pastel glassy UI, unlockable sparkles based on writing, persistent via localStorage.
 */
function Journal() {
  // State for today's entry (by date), all entries, input fields
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd key
  const [entries, setEntries] = useState({});
  const [text, setText] = useState("");
  const [moods, setMoods] = useState([]);
  const [prompt, setPrompt] = useState(getRandomPrompt());
  const [showSparkles, setShowSparkles] = useState([]);
  const textareaRef = useRef();

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEntries(parsed);
        if (parsed[today]) {
          setText(parsed[today].text || "");
          setMoods(parsed[today].moods || []);
        }
      }
    } catch (_) {}
  }, [today]);

  // Save changes to localStorage whenever text or moods update
  useEffect(() => {
    if (text.trim().length === 0 && moods.length === 0) return;
    const updated = {
      ...entries,
      [today]: {
        text,
        moods,
        date: today,
        ts: Date.now(),
      }
    };
    setEntries(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // eslint-disable-next-line
  }, [text, moods]);

  // Update sparkles based on diary lines (more lines = more unlocks)
  useEffect(() => {
    let count = (text || "").split("\n").filter(Boolean).length;
    let unlocked = SPARKLE_THRESHOLDS.filter(s => count >= s.lines);
    setShowSparkles(unlocked);
  }, [text]);

  // Mood tag (toggle add/remove)
  function handleMoodClick(tag) {
    setMoods(prev =>
      prev.some(m => m.label === tag.label)
        ? prev.filter(m => m.label !== tag.label)
        : [...prev, tag]
    );
  }

  // Handle daily prompt change
  function handlePromptChange() {
    let newPrompt;
    do {
      newPrompt = getRandomPrompt();
    } while(newPrompt === prompt);
    setPrompt(newPrompt);
  }

  // Save diary (extra feedback)
  function handleSave(e) {
    e.preventDefault();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...entries,
      [today]: { text, moods, date: today, ts: Date.now() }
    }));
  }

  // View previous days (simple dropdown)
  const [showHistory, setShowHistory] = useState(false);
  const sortedDays = Object.keys(entries).sort().reverse();

  // UI: dreamy glassy
  return (
    <section style={{ padding: "2.5rem 0", minHeight: "90vh", width: "100%" }}>
      <h1
        className="dreamy-accent-text"
        style={{
          fontWeight: 700,
          fontSize: "2.1rem",
          letterSpacing: "-.01em",
          textAlign: "center",
          marginBottom: "0.19em",
        }}
      >
        Journal
      </h1>

      {/* Gentle pastel prompt */}
      <GlassyCard
        accentColor="#ffabd2"
        style={{
          margin: "0 auto 24px auto",
          padding: "1.1rem 1.3rem",
          maxWidth: 410,
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.37)",
        }}
      >
        <span
          role="img"
          aria-label="soft prompt"
          style={{
            fontSize: "1.25em",
            marginRight: 9,
            verticalAlign: "middle",
          }}
        >
          🌸
        </span>
        <span style={{ color: "#caaaff", fontWeight: 600 }}>
          {prompt}
        </span>
        <button
          aria-label="New gentle prompt"
          onClick={handlePromptChange}
          style={{
            marginLeft: 18,
            background: "rgba(246,233,253,0.31)",
            border: "none",
            color: "#b477e0",
            fontWeight: 600,
            borderRadius: 16,
            fontSize: "1em",
            padding: "0.1em 0.98em",
            cursor: "pointer",
            transition: "background .13s, color .13s",
          }}
        >
          ✨ new prompt
        </button>
      </GlassyCard>

      {/* Main dreamy diary card */}
      <GlassyCard
        accentColor="#caaaff"
        style={{
          margin: "0 auto",
          padding: "2.1rem 1.35rem 1.13rem 1.35rem",
          minWidth: 280,
          maxWidth: 450,
          background: "rgba(255,255,255,0.47)",
          backdropFilter: "blur(25px)",
          boxShadow:
            "0 18px 44px 0 rgba(202,170,255,0.24), 0 1.5px 2px #ffabd255",
          position: "relative"
        }}
      >
        {/* Unlockable sparkles banner */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 9,
            minHeight: 30,
            fontWeight: 600
          }}
          aria-live="polite"
        >
          {showSparkles.map((s, i) => (
            <span
              key={s.emoji}
              style={{
                fontSize: "1.33rem",
                margin: "0 5px",
                filter: "drop-shadow(0 3px 18px #caaaff99)",
              }}
              title={s.desc}
              role="img"
              aria-label={s.desc}
            >
              {s.emoji}
            </span>
          ))}
          {showSparkles.length === 0 && (
            <span style={{ color: "#b477e0", fontWeight: 400, fontSize: 14.8 }}>
              Write a little to unlock dreamy sparkles!
            </span>
          )}
        </div>
        {/* Mood tags (chips) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {MOOD_TAGS.map(tag => (
            <button
              key={tag.label}
              type="button"
              onClick={() => handleMoodClick(tag)}
              className="mood-tag"
              aria-pressed={moods.some(m => m.label === tag.label)}
              style={{
                background: moods.some(m => m.label === tag.label)
                  ? `linear-gradient(90deg,${tag.color}60 65%,#fff7 100%)`
                  : `rgba(255,255,255,.74)`,
                border: moods.some(m => m.label === tag.label)
                  ? `2px solid ${tag.color}`
                  : "2px solid #ffeaf4",
                color: tag.color,
                fontWeight: moods.some(m => m.label === tag.label) ? 700 : 600,
                fontSize: "1.13rem",
                borderRadius: 18,
                padding: "6px 16px",
                boxShadow: moods.some(m => m.label === tag.label)
                  ? "0 2px 9px #ffabd233"
                  : "none",
                cursor: "pointer",
                transition: "background .13s, color .13s",
                outline: "none"
              }}
            >
              <span style={{marginRight: 5}}>{tag.emoji}</span>
              {tag.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSave} autoComplete="off">
          {/* Diary textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Let your thoughts float here (private, gentle, just for you)..."
            style={{
              width: "100%",
              minHeight: 100,
              maxHeight: 230,
              fontSize: "1.11em",
              fontFamily:
                "Quicksand, Baloo 2, Comic Sans MS, cursive, Arial, sans-serif",
              background:
                "linear-gradient(90deg,#ffeaf4 10%,#caaaff11 100%)",
              border: "2.5px solid #caaaff66",
              borderRadius: 19,
              boxShadow:
                "0 2px 12px #ffabd211, 0 0.5px 2px #ffeaf422",
              color: "#b477e0",
              padding: "13px 16px",
              marginBottom: 11,
              resize: "vertical",
              outline: "none",
              transition: "border-color .14s",
            }}
            maxLength={2000}
            autoFocus
            aria-label="Journal entry"
            spellCheck
          />
          {/* Save button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginTop: 4,
            }}
          >
            <button
              type="submit"
              style={{
                background:
                  "linear-gradient(89deg,#caaaff 50%, #ffabd213 90%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1em",
                border: "none",
                borderRadius: 14,
                padding: "0.48em 1.7em",
                boxShadow: "0 2px 19px #caaaff22",
                cursor: "pointer",
                minWidth: 110,
                transition: "background .13s,color .13s"
              }}
              aria-label="Save journal"
            >
              Save
            </button>
            <div style={{fontSize: 13, color: "#b477e0"}}>
              {text.trim().length}/2000 chars
            </div>
          </div>
        </form>
        {/* History dropdown */}
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <button
            style={{
              background: "rgba(202,170,255,0.16)",
              border: "none",
              color: "#b477e0",
              fontWeight: 600,
              borderRadius: 13,
              padding: "3px 14px",
              fontSize: ".97em",
              marginBottom: 4,
              cursor: "pointer",
              transition: "background .11s"
            }}
            onClick={() => setShowHistory((s) => !s)}
            aria-expanded={showHistory}
          >
            📜 {showHistory ? "Hide" : "Show"} My Journal History
          </button>
          {showHistory && (
            <div
              style={{
                background: "rgba(255, 255, 255, .82)",
                borderRadius: 12,
                padding: "1em 1.1em",
                marginTop: 7,
                maxHeight: 172,
                overflowY: "auto",
                textAlign: "left"
              }}
              aria-live="polite"
            >
              {sortedDays.length === 0 ? (
                <span
                  style={{
                    color: "#caaaff",
                    fontWeight: 600,
                    fontSize: 14.5
                  }}
                >Nothing yet… your first cloud entry is today 🌥️</span>
              ) : (
                sortedDays.map(day => (
                  <div
                    key={day}
                    style={{
                      marginBottom: 10,
                      fontFamily: "Quicksand, Arial, sans-serif",
                      fontSize: 13.7,
                      color: day === today ? "#ffabd2" : "#b477e0",
                      fontWeight: day === today ? 700 : 590
                    }}
                  >
                    <span style={{ display: "block", marginBottom: 2 }}>
                      <span style={{ fontWeight: 500 }}>
                        {day === today ? "Today" : day}
                      </span>
                    </span>
                    {entries[day]?.text &&
                      <div style={{
                        background: "#f8f1ff",
                        padding: "7px 12px",
                        borderRadius: 8,
                        color: "#896baf",
                        lineHeight: 1.3,
                        fontSize: 13.3,
                        marginBottom: 2
                      }}>
                        “{entries[day]?.text.slice(0, 156)}
                        {entries[day]?.text.length > 156 ? "…" : ""}”
                      </div>
                    }
                    {entries[day]?.moods?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: 2
                        }}
                      >
                        {entries[day].moods.map((tag) =>
                          <span
                            key={tag.label}
                            style={{
                              background: "#ffeaf4",
                              border: "1.7px solid #ffabd2",
                              color: "#b477e0",
                              borderRadius: 7,
                              fontSize: 12,
                              padding: "0px 6px",
                              marginRight: 1,
                            }}
                          >
                            {tag.emoji}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </GlassyCard>
      {/* Sparkle effects overlay for celebration */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "fixed",
          left: 0, top: 0, width: "100vw", height: "100vh",
          zIndex: 29,
          opacity: 0.93
        }}
      >
        {showSparkles.map((s, i) => (
          <span
            key={s.desc}
            style={{
              position: "absolute",
              left: `${28 + i * 8 + (i * 35) % 76}%`,
              top: `${24 + i * 13 + (i * 37) % 39}%`,
              fontSize: 22 + 11 * (i % 3),
              opacity: 0.6 + (i * 0.22) % 0.4,
              filter: "blur(1.1px) brightness(1.33)",
              pointerEvents: "none",
              userSelect: "none",
              animation: `sparkleFloat 7.3s ${(i * .23)}s infinite alternate cubic-bezier(.59,.03,.39,.97)`
            }}
            role="img"
          >{s.emoji}</span>
        ))}
        <style>
          {`
            @keyframes sparkleFloat {
              0% { transform: translateY(0) scale(1); opacity: 1;}
              70% { opacity: 0.92;}
              100% { transform: translateY(-55px) scale(1.22); opacity: 0.18;}
            }
          `}
        </style>
      </div>
    </section>
  );
}

export default Journal;
