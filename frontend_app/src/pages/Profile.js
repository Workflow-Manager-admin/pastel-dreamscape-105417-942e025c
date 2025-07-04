import React, { useState, useRef, useEffect } from "react";
import GlassyCard from "../components/GlassyCard";
import { getStored, setStored, usePersistedState } from "../utils/storage";

// --- Constants for options and pastel themes ---
const PRONOUNS = [
  "they/them", "she/her", "he/him", "xe/xem", "fae/faer", "any", "custom"
];
const MOODS = [
  { name: "Serene", emoji: "😌", color: "#caaaff" },
  { name: "Sleepy", emoji: "😴", color: "#ffabd2" },
  { name: "Dreamy", emoji: "🫧", color: "#b477e0" },
  { name: "Loved", emoji: "💖", color: "#ffabd2" },
  { name: "Vibing", emoji: "🎶", color: "#ffeaf4" },
  { name: "Magical", emoji: "✨", color: "#ab85ca" }
];
const AVATARS = [
  { id: "cat", label: "Cat", emoji: "🐱" },
  { id: "bunny", label: "Bunny", emoji: "🐰" },
  { id: "bear", label: "Bear", emoji: "🧸" },
  { id: "alien", label: "Alien", emoji: "👽" },
  { id: "unicorn", label: "Unicorn", emoji: "🦄" }
];
const MUSIC = [
  { mood: "Chill", emoji: "🌧️", label: "Lo-fi Rain" },
  { mood: "Cozy", emoji: "☁️", label: "Dream Pop" },
  { mood: "Ethereal", emoji: "✨", label: "Softcore Galaxy" },
  { mood: "Energized", emoji: "🔥", label: "Hyperpop" },
  { mood: "Relaxed", emoji: "🌙", label: "Ambient Sleep" }
];
const STORAGE_KEY = "dreamscape-profile-v1";

// PUBLIC_INTERFACE
/**
 * Profile page: open, wide, multi-column layout with editable name, pronouns, avatar,
 * DOB, favorite mood/music, bio, picture upload, mood status, persisted robustly (localStorage or fallback).
 * Dreamy, pastel glassmorphic profile bar always visible at top.
 */
function Profile() {
  // -- State & Persistent Logic (robust persistence w/ error handling)
  const [profile, setProfile] = usePersistedState(STORAGE_KEY, {
    name: "",
    pronouns: "",
    pronounsCustom: "",
    dob: "",
    bio: "",
    avatar: AVATARS[0].id,
    mood: MOODS[0].name,
    music: MUSIC[0].mood,
    photo: "",
    photoFile: "",
    moodStatus: MOODS[0].emoji,
  });

  const fileInputRef = useRef();

  // -- Field change handler --
  const handleField = (k, v) => {
    setProfile(prev => ({ ...prev, [k]: v }));
  };

  // Photo upload and preview
  const handlePhoto = (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = (e) => {
      setProfile((prev) => ({
        ...prev,
        photo: e.target.result,
        photoFile: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  // Avatar/mood display helpers
  const avatarObj = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];
  const moodObj = MOODS.find(m => m.name === profile.mood) || MOODS[0];
  const musicObj = MUSIC.find(m => m.mood === profile.music) || MUSIC[0];

  // Responsive layout: fluid, 2-3 cols if wide, 1 col if mobile.
  // Dreamy, glassy, pastel floating bar for profile summary.

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1,
        paddingTop: 48
      }}
    >
      {/* Dreamy, persistent glassy profile bar */}
      <div
        className="dreamy-profile-bar"
        style={{
          width: "min(97vw, 695px)",
          minWidth: 180,
          borderRadius: 38,
          padding: "1.25em 2.3em 1.1em 2.2em",
          boxShadow: "0 8px 40px 0 #caaaff23, 0 4px 32px -10px #ffabd2bb",
          background: "rgba(246,233,253,0.66)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 90,
          zIndex: 21,
          display: "flex",
          alignItems: "center",
          gap: 36,
          flexWrap: "wrap",
          border: "2.3px solid #caaaff56",
          overflow: "visible"
        }}
      >
        {/* Soft avatar circle */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(134deg,#ffeaf4 55%,#caaaff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3px 20px #caaaff55",
            fontSize: 49,
            border: "2px solid #ffabd244",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%"
              }}
            />
          ) : (
            <span role="img" aria-label={avatarObj.label}>
              {avatarObj.emoji}
            </span>
          )}
          <span
            style={{
              position: "absolute",
              right: 8,
              bottom: 5,
              fontSize: 21,
              background: "#ffeaf4",
              borderRadius: 8,
              padding: "1px 5.5px",
              border: "1.2px solid #caaaff99",
              color: moodObj.color,
              filter: "drop-shadow(0 2px 8px #ffabd2aa)"
            }}
            title="Favorite mood"
            aria-label="Mood"
          >
            {moodObj.emoji}
          </span>
        </div>
        {/* Name and pronouns */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <h2
            style={{
              color: "#b477e0",
              fontWeight: 800,
              fontFamily: "Baloo 2, cursive, Arial",
              fontSize: "2.1rem",
              letterSpacing: "-.018em",
              margin: 0,
              marginBottom: 2
            }}
          >
            {profile.name || <span style={{ fontWeight: 400, color: "#bcaede" }}>Your name</span>}
          </h2>
          <span
            style={{
              color: "#ffabd2",
              fontWeight: 500,
              fontSize: "1.09em",
              background: "rgba(255,171,210,0.15)",
              padding: "2px 14px",
              borderRadius: 18,
              marginRight: 7,
              fontFamily: "Quicksand, Baloo 2, cursive"
            }}
          >
            {profile.pronouns === "custom" ? profile.pronounsCustom || "your pronouns" : profile.pronouns || "—"}
          </span>
          {profile.dob && (
            <span
              style={{
                color: "#b477e0",
                background: "rgba(202,170,255,0.12)",
                padding: "2.3px 12px",
                borderRadius: 13,
                marginLeft: 5,
                fontSize: 15.5
              }}
            >
              🎂 {profile.dob}
            </span>
          )}
        </div>
        {/* Mood/music highlight */}
        <div
          style={{
            background: "rgba(202,170,255,0.15)",
            borderRadius: 17,
            padding: "9px 18px",
            color: "#ab85ca",
            fontWeight: 600,
            minWidth: 110,
            fontSize: "1.1em",
            boxShadow: "0 3px 12px #ffabd222"
          }}
        >
          <span role="img" aria-label="Mood" style={{ marginRight: 6 }}>
            {moodObj.emoji}
          </span>
          {moodObj.name}
          <span style={{ margin: "0 8px" }}>|</span>
          <span role="img" aria-label="Favorite Music">
            {musicObj.emoji}
          </span>{" "}
          {musicObj.label}
        </div>
      </div>

      {/* Dreamy pastel GlassyCard form, fluid grid layout */}
      <GlassyCard
        accentColor="#caaaff"
        style={{
          width: "100%",
          maxWidth: 895,
          marginTop: 34,
          marginBottom: 40,
          padding: "2.0rem 1.6rem 2.1rem 1.6rem",
          background: "rgba(255,255,255,0.59)",
          backdropFilter: "blur(20px)"
        }}
      >
        <form
          autoComplete="off"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
            gap: "2.1rem 1.3rem"
          }}
        >
          {/* Name & Pronouns */}
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Name
              <input
                type="text"
                value={profile.name}
                onChange={e => handleField("name", e.target.value.slice(0, 32))}
                maxLength={32}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "7px 18px",
                  borderRadius: 14,
                  border: "2px solid #ffeaf4",
                  fontSize: "1.13em",
                  color: "#b477e0",
                  background: "rgba(246,233,253,0.28)",
                  transition: "border-color .15s"
                }}
                placeholder="Your soft name"
                spellCheck="true"
                aria-label="Name"
              />
            </label>
          </div>

          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Pronouns
              <select
                value={profile.pronouns}
                onChange={e => handleField("pronouns", e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "7px 18px",
                  borderRadius: 14,
                  border: "2px solid #ffeaf4",
                  fontSize: "1.11em",
                  color: "#b477e0",
                  background: "rgba(246,233,253,0.28)"
                }}
                aria-label="Pronouns"
              >
                <option value="">Select…</option>
                {PRONOUNS.map(p =>
                  <option key={p} value={p}>{p}</option>
                )}
              </select>
              {profile.pronouns === "custom" && (
                <input
                  type="text"
                  value={profile.pronounsCustom}
                  onChange={e => handleField("pronounsCustom", e.target.value.slice(0, 32))}
                  maxLength={32}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "7px 18px",
                    borderRadius: 14,
                    border: "2px solid #ffeaf4",
                    fontSize: "1.09em",
                    color: "#b477e0",
                    background: "rgba(246,233,253,0.18)"
                  }}
                  placeholder="Your custom pronouns"
                  aria-label="Custom pronouns"
                />
              )}
            </label>
          </div>

          {/* DOB & mood */}
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Date of Birth
              <input
                type="date"
                value={profile.dob}
                onChange={e => handleField("dob", e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "7px 18px",
                  borderRadius: 14,
                  border: "2px solid #ffeaf4",
                  fontSize: "1.13em",
                  color: "#b477e0",
                  background: "rgba(246,233,253,0.22)"
                }}
                aria-label="DOB"
              />
            </label>
          </div>
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              What’s your current mood?
              <div style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 7
              }}>
                {MOODS.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    aria-label={m.name}
                    className={profile.mood === m.name ? "dreamy-accent-text" : ""}
                    tabIndex={0}
                    onClick={() => {
                      handleField("mood", m.name);
                      handleField("moodStatus", m.emoji);
                    }}
                    style={{
                      background: profile.mood === m.name
                        ? `linear-gradient(89deg,${m.color}55 68%,#ffeaf4 100%)`
                        : "#fff7",
                      border: profile.mood === m.name
                        ? `2.3px solid ${m.color}`
                        : "2px solid #ffeaf4",
                      color: m.color,
                      fontWeight: profile.mood === m.name ? 700 : 600,
                      fontSize: "1.11em",
                      borderRadius: 18,
                      padding: "7px 17px",
                      boxShadow: profile.mood === m.name
                        ? "0 2px 9px #ffabd233"
                        : "none",
                      cursor: "pointer",
                      opacity: 0.94,
                      outline: "none"
                    }}
                  >
                    <span style={{ marginRight: 7 }}>{m.emoji}</span>
                    {m.name}
                  </button>
                ))}
              </div>
            </label>
          </div>
          {/* Avatar & music */}
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Choose Your Avatar
              <div style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 7
              }}>
                {AVATARS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={profile.avatar === a.id ? "dreamy-accent-text" : ""}
                    aria-label={a.label}
                    tabIndex={0}
                    onClick={() => handleField("avatar", a.id)}
                    style={{
                      background: profile.avatar === a.id
                        ? `linear-gradient(88deg,#ffabd238 25%,#caaaff31 100%)`
                        : "#fff7",
                      border: profile.avatar === a.id
                        ? `2.4px solid #caaaff`
                        : "2px solid #ffeaf4",
                      color: "#b477e0",
                      fontWeight: profile.avatar === a.id ? 700 : 600,
                      fontSize: "1.6em",
                      borderRadius: 15,
                      padding: "4px 13px",
                      boxShadow: "0 2px 9px #caaaff11",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <span style={{ marginRight: 2 }}>{a.emoji}</span>
                  </button>
                ))}
              </div>
            </label>
          </div>
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Favorite Ambient/Mood Music
              <select
                value={profile.music}
                onChange={e => handleField("music", e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: "7px 18px",
                  borderRadius: 14,
                  border: "2px solid #ffeaf4",
                  fontSize: "1.13em",
                  color: "#b477e0",
                  background: "rgba(246,233,253,0.29)"
                }}
                aria-label="Favorite Music"
              >
                {MUSIC.map(m =>
                  <option key={m.mood} value={m.mood}>{m.emoji} {m.label}</option>
                )}
              </select>
            </label>
          </div>
          {/* Dreamy profile image upload */}
          <div>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Profile Picture
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginTop: 9 }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    background:
                      "linear-gradient(89deg,#caaaff 50%, #ffabd213 90%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.06em",
                    border: "none",
                    borderRadius: 14,
                    padding: "0.5em 1.2em",
                    boxShadow: "0 2px 11px #caaaff22",
                    cursor: "pointer",
                    marginRight: 13
                  }}
                  aria-label="Upload Photo"
                >
                  {profile.photo ? "Change" : "Upload"} Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhoto}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {profile.photo && (
                  <span
                    style={{
                      fontSize: "0.93em",
                      color: "#b477e0",
                      fontWeight: 500,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: 72,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {profile.photoFile}
                  </span>
                )}
              </div>
            </label>
          </div>
          {/* Bio/fav dream */}
          <div style={{ gridColumn: "span 2" }}>
            <label className="dreamy-accent-text" style={{ fontWeight: 700, fontSize: "1.09rem" }}>
              Your Dream, Favorite Bio, Wishes...
              <textarea
                value={profile.bio}
                onChange={e => handleField("bio", e.target.value.slice(0, 400))}
                maxLength={400}
                rows={3}
                style={{
                  width: "100%",
                  minHeight: 68,
                  maxHeight: 120,
                  fontSize: "1.11em",
                  fontFamily: "Quicksand, Baloo 2, Comic Sans MS, cursive, Arial, sans-serif",
                  background: "linear-gradient(90deg,#ffeaf418 10%,#caaaff11 100%)",
                  border: "2.1px solid #caaaff33",
                  borderRadius: 17,
                  boxShadow: "0 2px 12px #ffabd211, 0 0.5px 2px #ffeaf422",
                  color: "#b477e0",
                  padding: "8px 17px",
                  marginTop: 7,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color .14s"
                }}
                placeholder="Tell us something gentle and magical about you :)"
                spellCheck
                aria-label="Profile bio"
              />
            </label>
            <div style={{textAlign: "right", fontSize: 14.6, color: "#bcaede"}}>
              {profile.bio.length}/400
            </div>
          </div>
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#bcaede",
            fontSize: 15.3,
            fontWeight: 500
          }}
        >
          Changes will save automatically. All your info remains on this device.<br />
          <span style={{
            color: "#ffabd2",
            fontWeight: 600,
            fontSize: 15.5
          }}>
            Your softcore galaxy profile is yours alone!
          </span>
        </div>
      </GlassyCard>
      {/* Responsive/soft pastel style assistance */}
      <style>
        {`
        .dreamy-profile-bar {
          animation: dreamyPopIn 1.3s cubic-bezier(.69,-0.11,.18,1.09);
        }
        @keyframes dreamyPopIn {
          0% { opacity: 0; transform: translateY(-21px) scale(0.98);}
          44% { opacity: 1;}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        @media (max-width: 890px) {
          .dreamy-profile-bar {
            flex-wrap: wrap;
            gap: 10px !important;
            padding: 12px 0.9em 16px 1.22em !important;
          }
        }
        @media (max-width: 690px) {
          .dreamy-profile-bar {
            min-width: 100px;
            padding: 0.7em 0.11em 0.8em 0.6em !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Profile;
