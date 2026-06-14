import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { Send, Search } from "lucide-react";

export default function Chat() {
  const { activeRoom, sendMessage } = useContext(SocketContext);
  const { username } = useContext(ProfileContext);

  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoom?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const filteredMessages = activeRoom?.messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full brutal-card bg-[#eae0d0]/50 dark:bg-charcoal/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black dark:border-zinc-700 bg-[#eae0d0]/30 dark:bg-black/20 shrink-0">
        <div>
          <h3 className="font-extrabold text-base uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Room Chat</h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 font-mono font-bold uppercase mt-0.5 animate-pulse">
            {activeRoom?.messages.length || 0} messages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 bg-white dark:bg-[#1a1a20] border-2 border-black rounded-xl text-xs focus:outline-none focus:border-crimson text-zinc-950 dark:text-white font-mono"
              placeholder="Filter..."
              autoFocus
            />
          )}
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery("");
            }}
            className="p-2 bg-white dark:bg-[#1a1a20] border-2 border-black hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all shadow-flatHover active:shadow-none"
          >
            <Search className="w-4 h-4 text-zinc-650 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-white/20 dark:bg-black/10">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-xs font-mono uppercase font-bold">
            {searchQuery ? "No matching messages" : "Send a message to start chat"}
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelf = msg.username === username;
            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-350 font-mono">{msg.username}</span>
                  <span className="text-[9px] text-zinc-400 font-mono font-bold">{formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm border-2 border-black shadow-flatHover ${
                    isSelf
                      ? "bg-crimson text-white rounded-tr-none font-bold"
                      : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-white rounded-tl-none font-medium"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t-2 border-black dark:border-zinc-700 shrink-0 bg-[#eae0d0]/20 dark:bg-black/20 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow brutal-input"
          placeholder="Write a message..."
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 bg-crimson disabled:bg-zinc-100 disabled:opacity-40 disabled:shadow-none text-white border-2 border-black rounded-xl shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
