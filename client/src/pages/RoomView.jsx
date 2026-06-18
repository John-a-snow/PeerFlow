import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useFileTransfer } from "../hooks/useFileTransfer";
import { ThemeContext } from "../context/ThemeContext";
import Chat from "../components/Chat";
import FileTransferPanel from "../components/FileTransferPanel";
import ResourceHub from "../components/ResourceHub";
import QRJoin from "../components/QRJoin";
import { LogOut, Copy, Check, Users, MessageSquare, Share2, FolderHeart, QrCode, Sun, Moon } from "lucide-react";

export default function RoomView() {
  const { activeRoom, leaveRoom } = useContext(SocketContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const fileTransferState = useFileTransfer();

  const [activeTab, setActiveTab] = useState("chat");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeRoom?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-cream dark:bg-darkBg text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
      <aside className="w-full md:w-80 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#eae0d0] dark:bg-charcoal flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold truncate uppercase tracking-wide text-zinc-950 dark:text-zinc-50">{activeRoom?.name}</h2>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a20] border-2 border-black rounded-xl shadow-flatHover">
              <div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider block font-bold">Room Code</span>
                <span className="font-mono font-extrabold text-lg text-crimson">{activeRoom?.code}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-white dark:bg-[#1a1a20] border-2 border-black hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all shadow-flatHover active:shadow-none"
              >
                {copied ? <Check className="w-4 h-4 text-cyberGreen" /> : <Copy className="w-4 h-4 text-zinc-650 dark:text-zinc-400" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex-grow flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-[#1a1a20] border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
            >
              <QrCode className="w-4 h-4" /> QR Code
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-white dark:bg-[#1a1a20] border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-xl transition-all text-zinc-650 dark:text-zinc-350"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-black" />
              ) : (
                <Sun className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {showQr && (
            <div className="p-3 bg-white dark:bg-[#1a1a20] border-2 border-black rounded-xl flex justify-center shadow-flatHover animate-in fade-in slide-in-from-top-3 duration-200">
              <QRJoin roomCode={activeRoom?.code} />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest font-mono">
              <Users className="w-3.5 h-3.5" /> Members ({activeRoom?.users.length || 0})
            </div>
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {activeRoom?.users.map((user) => (
                <div key={user.socketId} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a20] border-2 border-black rounded-xl shadow-flatHover">
                  <span className="text-xl">{user.avatar}</span>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-extrabold truncate text-zinc-950 dark:text-zinc-50">{user.username}</p>
                    <span className="inline-flex items-center gap-1.5 text-[9px] text-cyberGreen font-mono font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyberGreen" /> Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={leaveRoom}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 brutal-btn-secondary text-sm animate-none"
        >
          <LogOut className="w-4 h-4" /> Leave Room
        </button>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 p-4 md:p-6 space-y-6">
        <div className="flex gap-2 self-start">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-5 py-2.5 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "chat"
                ? "bg-crimson text-white shadow-flatHover translate-x-[1px] translate-y-[1px]"
                : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-white shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px]"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center gap-2 px-5 py-2.5 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "files"
                ? "bg-crimson text-white shadow-flatHover translate-x-[1px] translate-y-[1px]"
                : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-white shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px]"
            }`}
          >
            <Share2 className="w-4 h-4" /> Share Files
          </button>
          <button
            onClick={() => setActiveTab("hub")}
            className={`flex items-center gap-2 px-5 py-2.5 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "hub"
                ? "bg-crimson text-white shadow-flatHover translate-x-[1px] translate-y-[1px]"
                : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-white shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px]"
            }`}
          >
            <FolderHeart className="w-4 h-4" /> Resource Hub
          </button>
        </div>

        <div className="flex-grow min-h-0 relative">
          {activeTab === "chat" && <Chat />}
          {activeTab === "files" && <FileTransferPanel fileTransferState={fileTransferState} />}
          {activeTab === "hub" && <ResourceHub />}
        </div>
      </main>
    </div>
  );
}