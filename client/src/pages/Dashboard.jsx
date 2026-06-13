import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { ThemeContext } from "../context/ThemeContext";
import { Users, Plus, Key, Radio, Compass, RefreshCw, X, Shield, Sun, Moon } from "lucide-react";

export default function Dashboard() {
    const { createRoom, joinRoom, error. clearError, isConnectedd } = useContext(SocketContext);
    const { username, setUsername, avatar, setAvatar, avatarList } = useContext(ProfileContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [activeRooms, setActiveRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showJoinDialog, setNewRoomName] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [joinRoomCode, setJoinRoomCode] = useState("");
    const [profileMsg, setProfileMsg] = useState("");
    const fetchRooms = async () => {
       setLoading(true);
      try {
        const serverUrl = import.meta.env.DEV
        ? `http://${window.location.hostname}:5000/api/rooms`
        : "/api/rooms";
      const response = await fetch(serverUrl);
      const data = await response.json();
      setActiveRooms(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomName,trim());
    createRoom(newRoomName.trim());
  };

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) return;
    joinRoom(joinRoomCode.trim());
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileMsg("Profile synced locally!");
    setTimeout(() => setProfileMsg(""), 3000);
  };

  const totalLanUsers = activeRooms.reduce(acc, r) => acc + r.usersCount, 0);

  return (
    <div className="min-h-screen relative flex flex-col justify-between grid-bg bg-cream dark:bg-darkBg text-zinc-950 dark:text-zinc-50 px-4 md:px-8">
       <div className="bsolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,55,80,0.06)_0%,transparent_50%)] pointer-events-none" />  

       <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-8 relative z-10">
         <div className="w-12 h-12 border-2 border-black bg-crimson flex items-center justify-center font-bold text-2xl text-white shadow-flat rounded-2xl">
            P
         </div>
         <span className="font-extrabold text-3xl tracking-tight uppercase text-zinc-950 dark:text-zinc-50">PEERFLOW</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex-items-center gap-3 px-4 py-4 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat rounded-2xl text-xs text-xs font-mono  font-bold">
<span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-cyberGreen animate-pulse" : "bg-crimson"}`} />
            <span className="text-zinc-650 dark:text-zinc-400">
              {isConnected ? "SERVER LIVE" : "OFFLINE"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-white dark:bg-[#1a1a20] border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-2xl transition-all text-zinc-650 dark:text-zinc-350"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-black" />
            ) : (
               <Sun className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </header>
      
      <main className="w-full max-w-6xl mx-auto flex-grow py-6 relative z-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="brutal-card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl border-2xl border-2 border-black bg-crimson flex items-center justify-center text-white shadow-flat shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block font-bold">Active Rooms</span>
            <span className="text-3xl font-extrabold font-mono text-zinc-950 dark:text-zinc-50">{activeRooms}</span>
          </div>
        </div>
        <div className="brutal-card p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl border-2 border-black bg-cyberGreen flex items-center justify-center text-zinc-950 shadow-flat shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider font-bold">Active Peers</span>
            <span className="w-14 h-14 rounded-2xl border-2xl border-2 border-black bg-cyberGold flex items-center justify-center text-zinc-950 shadow-flat shrink-0">
            </div>
          </div>
          <div className="brutal-card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl border-2 border-black bg-cyberGold flex items-center justify-center text-zinc-950 shadow-flat shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block font-bold">LAN Host</span>
              <span className="text-sm font-bold font-mono text-zinc-750 dark:text-zinc-300 truncate">{window.location.hostname}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"
        </div>
