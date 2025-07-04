import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Home page: A magical, floating, pastel-dream intro and gentle onboarding,
 * with a sparkling animated header, full-width whimsical "What This App Is" section,
 * animated feature grid (My Room/Journal/Music/Shop/Profile) with pastel icons and blur-on-hover reveals,
 * daily prompt whisper with 'Write Now' CTA, floating animated mood bubble with soft validation,
 * gentle copywriting everywhere, and dreamy motion/sparkles throughout.
 * Everything is full-width/floating, NO boxed center-alignment, all gradients/glows/pills per style spec.
 */
const FEATURE_GRID = [
  {
    label: "My Room",
    emoji: "🏡",
    tagline: "Decorate your dreamy space",
    desc: "Drag & drop pastel decor, pin favorite affirmations, express your current mood, and shape your magical haven.",
    href: "/room",
    color: "#caaaff",
    glow: "#aee7fd"
  },
  {
    label: "Journal",
    emoji: "📓",
    tagline: "Gentle mood journaling",
    desc: "Daily prompts and soft tagging to celebrate every cloud, sparkle, emotion and dream. Your heart is safe here.",
    href: "/journal",
    color: "#ffabd2",
    glow: "#ffeaf4"
  },
  {
    label: "Music",
    emoji: "🎶",
    tagline: "Pastel playlists for every vibe",
    desc: "Take a gentle mood+color quiz, unlock lo-fi, dream pop, cloud-hop tunes—curated for every emotion.",
    href: "/music",
    color: "#aee7fd",
    glow: "#ffabd2"
  },
  {
    label: "Shop",
    emoji: "🌟",
    tagline: "Unlock magical decor",
    desc: "Use stars to collect softcore decor, outfits, and soundpacks. Journal to unlock more gentle treasures.",
    href: "/shop",
    color: "#ffe9c3",
    glow: "#caaaff"
  },
  {
    label: "Profile",
    emoji: "🦄",
    tagline: "Express your soft galaxy",
    desc: "Choose your name, pronouns, avatar, ambient, wishes, and mood—at your own pace.",
    href: "/profile",
    color: "#b477e0",
    glow: "#ffeaf4"
  },
];

const DAILY_PROMPTS = [
  "Today's prompt: What quiet beauty or softness found you today?",
  "How is your heart feeling, truly, in a single color or cloud?",
  "If you could decorate your safe space with any dream, what would it be?",
  "How would you write a love letter to your current mood?",
  "What small thing brought you comfort, or made you feel seen?",
  "Whisper something to your future self: what do you want them to know?",
  "Draw your feeling in pastel shapes and sparkles—what does it look like?"
];

// Mood emoji choices for bubble selector
const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🥹", label: "Tender" },
  { emoji: "🫧", label: "Dreamy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "✨", label: "Magical" },
  { emoji: "☁️", label: "Cloudy" },
  { emoji: "💖", label: "Loved" },
  { emoji: "😭", label: "Blue" },
  { emoji: "😴", label: "Sleepy" }
];

function getRandomPrompt() {
  return DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)];
}
function getRandomMood() {
  return MOODS[Math.floor(Math.random() * MOODS.length)].emoji;
}

// PUBLIC_INTERFACE
function Home() {
  const [prompt, setPrompt] = useState(getRandomPrompt());
  const [bubbleMood, setBubbleMood] = useState(getRandomMood());
  const [showPicker, setShowPicker] = useState(false);
  const [chosenMood, setChosenMood] = useState("");
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  // Softly animate mood bubble emoji
  useEffect(() => {
    if (showPicker) return;
    const interval = setInterval(() => {
      setBubbleMood(getRandomMood());
    }, 6200);
    return () => clearInterval(interval);
  }, [showPicker]);

  // Gentle validated animation
  useEffect(() => {
    let timeout;
    if (validated) {
      timeout = setTimeout(() => setValidated(false), 2300);
    }
    return () => clearTimeout(timeout);
  }, [validated]);

  // --- UI ---
  return (
    <div
      role="main"
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflow: "visible",
        background: "none",
        display: "block",
        position: "relative",
        zIndex: 1
      }}
    >
      {/* --- Floating, glowing, animated welcome header with sparkles --- */}
      <section
        style={{
          margin: "min(6vw,62px) 0 0 0",
          width: "100%",
          padding: "0 0 0.9em 0",
          position: "relative",
          overflow: "visible",
        }}
        aria-label="Welcome"
      >
        {/* Sparkle stars (animated, some twinkling) */}
        <div className="dreamy-sparkle-layer" aria-hidden="true" style={{
          pointerEvents: "none",
          position: "absolute",
          left: 0, top: 0, width: "100%", height: "100%",
          zIndex: 3
        }}>
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="dreamy-sparkle"
              style={{
                left: `${14 + (i * 13 + i * 49) % 81}%`,
                top: `${(9 + (i * 43 + i * 8) % 89)}%`,
                width: 14 + (i % 2) * 7 + (i % 3) * 3,
                height: 14 + (i % 2) * 7 + (i % 3) * 3,
                filter: `blur(${0.8 + (i % 2 ? 1.2 : 0.34)}px) brightness(1.${2 + i % 7})`,
                opacity: 0.7 + 0.21 * (i % 3),
                background: i % 3 === 2
                  ? "radial-gradient(circle,#ffabd244 70%,#ffeaf4bb 100%)"
                  : i % 2
                  ? "radial-gradient(circle,#caaaff77 80%,#ffeaf4bb 100%)"
                  : "radial-gradient(circle,#fff1 60%,#caaaff33 100%)",
                animationDelay: `${0.21 * i}s`
              }}
            />
          ))}
        </div>
        <h1
          className="dreamy-onboarding-header dreamy-shimmer-text"
          style={{
            fontFamily: "'Baloo 2', 'Comic Sans MS', cursive, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.12rem,6vw,3.4rem)",
            margin: "0 auto 0.09em auto",
            padding: "1.19em 0 0 0",
            letterSpacing: "-0.025em",
            color: "#caaaff",
            textShadow: "0 8px 45px #b477e099, 0 3px 6px #ffabd2cc",
            background: "none",
            boxShadow: "none",
            borderRadius: 0,
            width: "100%",
            textAlign: "center"
          }}
        >
          pastel dreamscape
        </h1>
        <p
          style={{
            fontFamily: "'Quicksand', 'Baloo 2', cursive, sans-serif",
            color: "#b477e0",
            fontSize: "1.22rem",
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "0.018em",
            margin: "0.6em auto 0.17em auto",
            textShadow: "0 1px 13px #ffeaf488"
          }}
        >
          a soft universe for celebrating every feeling <span aria-label="cloud sparkles">☁️✨</span>
        </p>
        {/* Soft floating petals/stars animation using blurred spans */}
        <div style={{
          width: "100%",
          margin: "0.6em auto 0 auto",
          textAlign: "center"
        }}>
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                fontSize: 22 + (i % 2) * 8,
                margin: "0 0.8em",
                opacity: 0.7,
                filter: "blur(0.8px) brightness(1.1)",
                animation: `welcomePetalFloat 8.${i+2}s ${i*.22}s ease-in-out infinite alternate`
              }}
            >{["✨","🌸","☁️","🌟","🫧","💖"][i]}</span>
          ))}
        </div>
        <style>
          {`
            @keyframes welcomePetalFloat {
              0% { transform: translateY(0) scale(.98);}
              46% { opacity: 1;}
              73% { transform: translateY(14px) scale(1.07) rotate(-3deg); opacity: 0.92;}
              100% { transform: translateY(-17px) scale(0.97);}
            }
          `}
        </style>
      </section>

      {/* --- What This App Is (full-width, softly animated) --- */}
      <section
        className="dreamy-shimmer-bg"
        style={{
          width: "100%",
          maxWidth: "98vw",
          margin: "2.2em 0 0.4em 0",
          padding: "1.7em 0.9em 1.8em 0.9em",
          borderRadius: 39,
          boxShadow: "0 8px 36px #ffeaf422, 0 2px 12px #caaaff22",
          background:
            "linear-gradient(109deg,#ffeaf4bb 11%,#caaaff88 97%)",
          border: "1.7px solid #ffabd244",
          backdropFilter: "blur(11px)",
          textAlign: "center",
          fontFamily: "'Quicksand','Baloo 2',cursive,sans-serif",
          fontSize: "1.23em",
          fontWeight: 500,
          color: "#b477e0",
          alignSelf: "center"
        }}
        aria-label="What is Pastel Dreamscape"
      >
        <span style={{fontWeight:800, color:'#ffabd2', fontSize:"1.14em"}}>Welcome to your magical self-care space!</span> <br />
        Every mood, hope, and soft wish deserves a home: decorate your <b>Room</b>, write gentle <b>Journal</b> entries, listen to curated <b>Music</b>, browse the <b>Shop</b>, and express in your <b>Profile</b>—all surrounded by clouds, sparkles, and unconditional validation.<br />
        <span style={{color:'#ab85ca', fontWeight:550}}><span role="img" aria-label="petal">🌸</span> Pick any feature to begin your dreamy journey below.</span>
      </section>

      {/* --- Animated feature grid --- */}
      <section
        style={{
          width: "min(96vw,1120px)",
          margin: "2.7em auto 1.9em auto",
          padding: 0,
          position: "relative",
          zIndex: 1
        }}
        aria-label="Features"
      >
        <div
          className="dreamy-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "2.2em 2.1em",
            width: "100%",
            justifyItems: "center"
          }}
        >
          {FEATURE_GRID.map((feat, idx) => (
            <FeatureCard
              key={feat.label}
              {...feat}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {/* --- Daily Prompt whisper & CTA --- */}
      <section
        style={{
          margin: "2.4em 0 1.4em 0",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          className="glassy-card dreamy-card"
          style={{
            background: "rgba(255,255,255,.44)",
            boxShadow: "0 8px 36px #ffabd233, 0 4px 18px #caaaff18",
            minWidth: 219,
            maxWidth: 400,
            padding: "1.1em 1.1em 1.4em 1.1em",
            border: "2.4px solid #caaaff",
            borderRadius: 25,
            margin: "0 1.4em",
            textAlign: "center",
            fontFamily: "'Quicksand', 'Baloo 2', cursive, Arial",
            color: "#ab85ca"
          }}
        >
          <span style={{fontSize:22, verticalAlign:'middle',marginRight:6}}>💫</span>
          <em>{prompt}</em>
          <div style={{marginTop:15}}>
            <button
              className="dreamy-btn"
              onClick={() => navigate('/journal')}
              style={{
                borderRadius: 33,
                background: "linear-gradient(92deg,#ffabd2 22%, #caaaff 86%)",
                color: "#fff",
                fontWeight: 700,
                fontSize:"1.09em",
                padding: "0.38em 2.05em",
                boxShadow: "0 2px 13px #caaaff22, 0 0px 9px #ffabd233",
                border: "none",
                marginRight: 8,
                marginBottom: 4,
                cursor: "pointer",
                transition: "background .17s, color .15s"
              }}
              aria-label="Go to Journal"
            >Write Now</button>
            <button
              style={{
                borderRadius: 19,
                background: "none",
                color:"#caaaff",
                fontWeight: 600,
                fontSize:"0.94em",
                padding: "0.21em 1.3em",
                border: "1.2px solid #caaaff99",
                cursor: "pointer",
                boxShadow:"none",
                transition: "background .11s"
              }}
              aria-label="New prompt"
              onClick={() => setPrompt(getRandomPrompt())}
            >New Prompt</button>
          </div>
        </div>
      </section>

      {/* --- Optional mood emoji bubble with validation animation --- */}
      <div
        className="floating-emoji-bubble"
        role="button"
        tabIndex={0}
        aria-label="Tap to set your mood"
        title={chosenMood ? `Your mood: ${chosenMood}` : "Tap to choose your mood"}
        onClick={() => { setShowPicker(true); setValidated(false); }}
        onKeyDown={e => { if(e.key==="Enter"||e.key===" ") { setShowPicker(true); setValidated(false); } }}
        style={{
          position: "fixed",
          right: 36,
          top: "42vh",
          zIndex: 33,
          pointerEvents: "auto",
          background: "radial-gradient(circle at 61% 36%, #ffeaf4bb 60%, #caaaff77 100%)",
          borderRadius: "50%",
          width: showPicker ? 88 : 62,
          height: showPicker ? 88 : 62,
          boxShadow: validated
            ? "0 7px 36px 0 #b477e055, 0 2px 22px #ffabd299"
            : "0 6px 36px 0 #ffabd25c, 0 2px 22px #caaaff33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "floatBubble 9s ease-in-out infinite alternate",
          filter: validated
            ? "drop-shadow(0 2px 13px #ffabd288) blur(0.3px) brightness(1.11)"
            : "blur(.1px) contrast(1.03) brightness(1.08)",
          border: validated
            ? "2.5px solid #b477e0"
            : "2.1px solid #caaaff44",
          transition:
            "all .21s cubic-bezier(.88,.04,.31,.96), border .09s, box-shadow .15s"
        }}
      >
        {/* Emoji or picker */}
        {!showPicker && (
          <span
            style={{
              fontSize: chosenMood ? "2.7rem" : "2.23rem",
              filter: "drop-shadow(0 2px 12px #ffabd299)",
              userSelect: "none",
              transition: "font-size .17s"
            }}
            role="img"
            aria-label={chosenMood ? "Your Mood" : "Pick a Mood"}
          >
            {chosenMood || bubbleMood}
          </span>
        )}
        {showPicker && (
          <MoodPicker
            moods={MOODS}
            onSelect={emoji => {
              setChosenMood(emoji);
              setShowPicker(false);
              setValidated(true);
              setBubbleMood(emoji);
            }}
          />
        )}
        {/* Validation animation (subtle sparkle/soft woosh) */}
        <div style={{
          position:"absolute",
          left:0,top:0,right:0,bottom:0,
          pointerEvents:"none",
          display: validated ? "block" : "none"
        }}>
         {[...Array(9)].map((_,i) => (
            <span
              key={i}
              style={{
                position:"absolute",
                left:`${19+(i*29)%60}%`,
                top:`${22+(i*13)%60}%`,
                fontSize:19+5*i,
                opacity:.28+.08*i,
                animation: `moodSparklePop 1.65s ${i*.16}s linear`,
                userSelect:"none"
              }}
              role="img"
              aria-label="sparkle"
            >✨</span>
          ))}
          <style>{`
           @keyframes moodSparklePop {
             0% { opacity:.2; filter:blur(2.2px);}
             50% { opacity:.7; filter:blur(.7px);}
             100% { opacity:0; filter:blur(2.8px) scale(1.4);}
           }
          `}
          </style>
        </div>
        {validated && (
          <span style={{
            position:"absolute",
            left:"50%",
            top:"-25%",
            transform:"translateX(-50%) scale(1)",
            fontSize:15,
            color:"#b477e0",
            background:"rgba(246,233,253,.87)",
            borderRadius:9,
            padding:"2.5px 12px",
            fontWeight:600,
            boxShadow:"0 1.5px 8px #ffabd299",
            animation:"validatePopIn 1.44s cubic-bezier(.77,-.36,.23,1.14)"
          }}>
            <span role="img" aria-label="Yay" style={{marginRight:5}}>🌸</span>
            Mood set!
          </span>
        )}
        <style>{`
          @keyframes floatBubble {
            0% { transform: translateY(-7px) scale(1);}
            70% { transform: translateY(18px) scale(1.13) rotate(4deg);}
            100% { transform: translateY(-5.5px) scale(1);}
          }
          @keyframes validatePopIn {
            0% { opacity: 0; transform: scale(.7);}
            42% { opacity: 1;}
            100% { opacity: 0; transform: scale(.98);}
          }
          @media (max-width: 768px){
            .floating-emoji-bubble {
              right: 4vw !important; top: 73vh !important;
              width: 52px !important; height: 52px !important;
            }
          }
        `}
        </style>
      </div>
    </div>
  );
}

// Feature navigation card (animated grid element)
function FeatureCard({ label, emoji, tagline, desc, href, color, glow, navigate }) {
  // Hover/active state
  const [hovered, setHovered] = useState(false);
  return (
    <div
      tabIndex={0}
      className="dreamy-card dreamy-feature-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => navigate(href)}
      role="region"
      aria-label={`${label} (navigate)`}
      style={{
        border: `2.5px solid ${color}`,
        borderRadius: 33,
        minHeight: 186,
        maxWidth: 270,
        width: "100%",
        background: hovered
          ? `linear-gradient(109deg,${glow}24 11%,${color}33 97%)`
          : "rgba(255,255,255,0.52)",
        boxShadow: hovered
          ? `0 13px 32px #caaaff32, 0 3px 14px #ffabd244, 0 2px 45px #caaaff33`
          : "0 6px 22px #caaaff11, 0 2px 6px #ffabd244",
        transform: hovered ? "scale(1.028)" : "scale(1)",
        cursor: "pointer",
        transition: "all .19s cubic-bezier(.69,-0.01,.38,1.13)",
        textAlign: "center",
        position: "relative",
        overflow: "visible"
      }}
    >
      {/* Feature card sparkles */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: 0, top: 0, width: "100%", height: "100%", zIndex: 1
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${17 + i *13}%`,
              top: `${12 + (i * 33)%63}%`,
              width: 9+5*i, height: 9+5*i,
              borderRadius: 11,
              background:
                i % 3 === 2
                  ? `radial-gradient(circle,${color}55 62%,${glow}BB 100%)`
                  : "radial-gradient(circle,#caaaff1a 77%,#ffabd2cc 100%)",
              filter: "blur(1.1px) brightness(1.07)",
              opacity: hovered ? .95 : .6,
              animation: `cardFeatureSparkle 7.${i+1}s ${i*.32}s linear infinite`
            }}
          />
        ))}
        <style>
          {`
          @keyframes cardFeatureSparkle {
            0% { opacity: .62; }
            40% { opacity: .99; }
            80% { opacity: .81;}
            100% { opacity: .62;}
          }
          `}
        </style>
      </div>
      <div
        style={{
          fontSize: "2.77rem",
          filter: "drop-shadow(0 1.6px 9px #caaaff66)",
          marginTop: "0.29em",
          marginBottom: "0.13em",
          transition: "transform .11s",
          transform: hovered ? "scale(1.24) rotate(-2deg)" : "scale(1.13)"
        }}
        role="img"
        aria-label={label}
      >{emoji}</div>
      <div
        style={{
          fontFamily: "'Baloo 2','Quicksand',cursive,Arial",
          color: color,
          fontWeight: 800,
          fontSize: "1.19rem",
          letterSpacing: "0.011em",
          marginBottom: 2,
          textShadow: "0 2px 11px #ffeaf499"
        }}>{label}
      </div>
      <div
        style={{
          color: "#b477e0",
          fontWeight: 570,
          fontSize: "0.99rem",
          marginBottom: hovered ? 13 : 7,
          transition: "color .15s, margin-bottom .13s"
        }}>{tagline}
      </div>
      {/* Reveal on hover/focus: full soft description */}
      <div
        aria-live="polite"
        style={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
          filter: hovered ? "blur(0.0px)" : "blur(3.2px)",
          color: "#84619b",
          fontWeight: 480,
          fontSize: ".95em",
          padding: ".7em 0 .2em 0",
          height: hovered ? "auto" : 0,
          overflow: "hidden",
          position:"relative",
          transition: "opacity .19s, filter .17s"
        }}>
        <span aria-label="Feature details">{desc}</span>
      </div>
    </div>
  );
}

// Mood emoji picker
function MoodPicker({ moods, onSelect }) {
  return (
    <div style={{
      position: "absolute",
      background: "rgba(255,255,255,0.92)",
      borderRadius: 18,
      boxShadow: "0 2px 24px #caaaff33, 0 1px 8px #ffabd288",
      zIndex: 39,
      left: "50%", top: "53%",
      transform: "translate(-50%,-50%)",
      minWidth: 136,
      minHeight: 67,
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      padding: "7px 8px",
      border: "1.7px solid #caaaff",
      animation: "pickerFloatIn 0.7s cubic-bezier(.44,1.54,.16,.99)"
    }}>
      {moods.map(({emoji,label},i) =>
        <button
          key={emoji}
          onClick={e => { e.preventDefault(); e.stopPropagation(); onSelect(emoji); }}
          style={{
            background: "linear-gradient(92deg,#ffabd249 10%,#caaaff12 100%)",
            color: "#b477e0",
            fontSize: 25,
            border: "2.1px solid #ffeaf4",
            borderRadius: 13,
            filter: "brightness(1.21)",
            boxShadow: "0 1.2px 11px #caaaff22",
            margin: "1.5px 3px",
            cursor: "pointer",
            padding: "3px 9.3px",
            outline: "none"
          }}
          aria-label={label}
        >{emoji}</button>
      )}
      <style>{`
       @keyframes pickerFloatIn {
         0% { opacity:0; transform: translate(-50%,-46%) scale(.8);}
         61% { opacity:1;}
         100% { opacity:1; transform:translate(-50%,-50%) scale(1);}
       }
      `}
      </style>
    </div>
  );
}

export default Home;
