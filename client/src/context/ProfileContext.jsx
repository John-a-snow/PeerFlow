import React, { createContext, useState, useEffect } from "react";

export const ProfileContext = createContext();

const AVATARS = ["boxing", "coffee", "dumbbell", "fish", "grape", "kiwi", "milk", "running", "scale", "yogurt"];

const ADJECTIVES = ["Quantum", "Hyper", "Cyber", "Vortex", "Nebula", "Cosmic", "Solar", "Pixel", "Vector", "Matrix"];
const NOUNS = ["Pioneer", "Hacker", "Drifter", "Runner", "Voyager", "Ranger", "Seeker", "Coder", "Shifter", "Spark"];

function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
}

export function ProfileProvider({ children }) {
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem("peerflow_username");
    return saved || generateRandomName();
  });

  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem("peerflow_avatar");
    return saved || AVATARS[Math.floor(Math.random() * AVATARS.length)];
  });

  useEffect(() => {
    localStorage.setItem("peerflow_username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("peerflow_avatar", avatar);
  }, [avatar]);

  return (
    <ProfileContext.Provider value={{ username, setUsername, avatar, setAvatar, avatarsList: AVATARS }}>
      {children}
    </ProfileContext.Provider>
  );
}
