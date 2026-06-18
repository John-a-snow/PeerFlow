import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { ThemeContext } from "../context/ThemeContext";
import { Users, Plus, Key, Radio, Compass, RefreshCw, X, Shield, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const { createRoom, joinRoom, error, clearError, isConnected } = useContext(SocketContext);
  const { username, setUsername, avatar, setAvatar, avatarsList } = useContext(ProfileContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
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
    if (!newRoomName.trim()) return;
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

  const totalLanUsers = activeRooms.reduce((acc, r) => acc + r.usersCount, 0);

  return (
    <div className="min-h-screen relative flex flex-col justify-between grid-bg bg-cream dark:bg-darkBg text-zinc-950 dark:text-zinc-50 px-4 md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,55,80,0.06)_0%,transparent_50%)] pointer-events-none" />

      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-black bg-crimson flex items-center justify-center font-bold text-2xl text-white shadow-flat rounded-2xl">
            P
          </div>
          <span className="font-extrabold text-3xl tracking-tight uppercase text-zinc-950 dark:text-zinc-50">PEERFLOW</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat rounded-2xl text-xs font-mono font-bold">
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
            <div className="w-14 h-14 rounded-2xl border-2 border-black bg-crimson flex items-center justify-center text-white shadow-flat shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block font-bold">Active Rooms</span>
              <span className="text-3xl font-extrabold font-mono text-zinc-950 dark:text-zinc-50">{activeRooms.length}</span>
            </div>
          </div>
          <div className="brutal-card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl border-2 border-black bg-cyberGreen flex items-center justify-center text-zinc-950 shadow-flat shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block font-bold">Active Peers</span>
              <span className="text-3xl font-extrabold font-mono text-zinc-950 dark:text-zinc-50">{totalLanUsers}</span>
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
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight leading-none text-zinc-950 dark:text-zinc-50 [-webkit-text-stroke:1px_#000] drop-shadow-[3px_3px_0px_#ec3750]">
                  Available Networks
                </h2>
                <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-1 font-mono">Connect to room nodes shared on LAN.</p>
              </div>
              <button
                onClick={fetchRooms}
                disabled={loading}
                className="p-3 bg-white dark:bg-[#1a1a20] border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-xl transition-all disabled:opacity-50 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {activeRooms.length === 0 ? (
              <div className="brutal-card p-12 text-center flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-charcoal/40">
                <Compass className="w-12 h-12 text-zinc-400" />
                <div>
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">No Rooms Detected</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">Spin up a local workspace node to start.</p>
                </div>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => setShowCreateDialog(true)} className="py-2.5 px-4 brutal-btn text-xs font-bold uppercase tracking-wider">
                    Create Room
                  </button>
                  <button onClick={() => setShowJoinDialog(true)} className="py-2.5 px-4 brutal-btn-secondary text-xs font-bold uppercase tracking-wider">
                    Join Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRooms.map((room) => (
                  <div key={room.code} className="brutal-card p-6 flex flex-col justify-between hover:border-crimson transition-all bg-white/40 dark:bg-charcoal/40">
                    <div>
                      <h4 className="font-extrabold text-base truncate text-zinc-950 dark:text-zinc-550">{room.name}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1 uppercase font-semibold">Code: {room.code}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black dark:border-zinc-700 mt-4">
                      <span className="text-xs text-zinc-650 dark:text-zinc-400 font-mono font-bold">{room.usersCount} peer(s) online</span>
                      <button
                        onClick={() => joinRoom(room.code)}
                        className="py-2 px-4 brutal-btn text-xs"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="brutal-card p-6 space-y-6 bg-white/50 dark:bg-charcoal/50">
              <div className="flex items-center justify-between border-b border-black dark:border-zinc-700 pb-4">
                <div>
                  <h3 className="font-extrabold text-base uppercase tracking-wider">Your Profile</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">Synced on this computer.</p>
                </div>
                <div className="w-14 h-14 rounded-2xl border-2 border-black bg-white dark:bg-[#1a1a20] flex items-center justify-center text-4xl shadow-flat shrink-0">
                  {avatar}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">User Handle</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16))}
                    className="w-full brutal-input bg-white dark:bg-[#1a1a20]"
                    placeholder="Enter handle"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Select Badge</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {avatarsList.slice(0, 10).map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setAvatar(av)}
                        className={`text-xl p-2 rounded-xl border-2 transition-all ${
                          avatar === av ? "bg-crimson/20 border-black shadow-flatHover" : "bg-white dark:bg-[#1a1a20] border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white"
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {profileMsg && <p className="text-xs text-cyberGreen font-mono font-semibold">{profileMsg}</p>}

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    type="button"
                    className="w-full py-3 px-4 brutal-btn text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Room Node
                  </button>
                  <button
                    onClick={() => setShowJoinDialog(true)}
                    type="button"
                    className="w-full py-3 px-4 brutal-btn-secondary text-sm flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4 text-zinc-450" /> Enter Room Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto py-8 border-t-2 border-black dark:border-zinc-700 text-center text-xs text-zinc-500 dark:text-zinc-455 relative z-10 mt-8 font-mono">
        <p>&copy; {new Date().getFullYear()} PeerFlow. Values persistent inside client LocalStorage.</p>
      </footer>

      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md brutal-card p-6 space-y-6 bg-white dark:bg-[#16161a] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg uppercase tracking-wider">Launch Room</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">Enter a room name to initialize.</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  clearError();
                }}
                className="p-1.5 hover:bg-white/5 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-lg text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Workspace Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full brutal-input"
                  placeholder="e.g. Java Project Team"
                  maxLength={32}
                />
              </div>

              {error && <div className="p-3 border-2 border-black bg-crimson/10 text-crimson text-xs rounded-xl font-mono">{error}</div>}

              <button
                type="submit"
                className="w-full py-3 brutal-btn text-sm"
              >
                Launch Room
              </button>
            </form>
          </div>
        </div>
      )}

      {showJoinDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md brutal-card p-6 space-y-6 bg-white dark:bg-[#16161a] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg uppercase tracking-wider">Connect Room</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">Enter code to link up.</p>
              </div>
              <button
                onClick={() => {
                  setShowJoinDialog(false);
                  clearError();
                }}
                className="p-1.5 hover:bg-white/5 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-lg text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinRoomSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Room Code</label>
                <input
                  type="text"
                  required
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  className="w-full brutal-input text-center tracking-widest text-xl uppercase font-bold dark:bg-[#1a1a20] dark:text-white"
                  placeholder="ABC123"
                  maxLength={6}
                />
              </div>

              {error && <div className="p-3 border-2 border-black bg-crimson/10 text-crimson text-xs rounded-xl font-mono">{error}</div>}

              <button
                type="submit"
                className="w-full py-3 brutal-btn text-sm"
              >
                Link Node
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
