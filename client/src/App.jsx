import React, { useContext, useEffect, useState } from "react";
import { ProfileProvider, ProfileContext } from "./context/ProfileContext";
import { SocketProvider, SocketContext } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RoomView from "./pages/RoomView";

function LoadingScreen() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const quotes = [
      "It's okay, my hotspot sucks too.",
      "Your computer just needs time to cook",
      "The coolness is almost here",
      "How's your day going?"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col justify-end p-8 md:p-12">
      <div className="space-y-1 text-right">
        <h1 className="text-3xl font-extrabold tracking-widest text-white font-mono uppercase">
          {"LOADING...".split("").map((c, i) => (
            <span
              key={i}
              className="gw-char animate-[gwave_2s_linear_infinite]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {c}
            </span>
          ))}
        </h1>
        <p className="text-zinc-550 text-xs font-mono">{quote}</p>
      </div>
    </div>
  );
}

function MainApp() {
  const { activeRoom, joinRoom } = useContext(SocketContext);
  const { username } = useContext(ProfileContext);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get("join");
    if (joinCode && username) {
      joinRoom(joinCode.toUpperCase());
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [username]);

  if (showLoader) {
    return <LoadingScreen />;
  }

  if (activeRoom) {
    return <RoomView />;
  }

  const hasProfile = localStorage.getItem("peerflow_profile_created");
  if (!hasProfile) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <SocketProvider>
          <MainApp />
        </SocketProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}