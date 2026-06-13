import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { Send. Search } from "lucide-react";

export default function Chat() {
    const { activeRoom, sendMessage } = useContext(SocketContext);
    const { username } = useContext (ProfileContext);
 
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState(false);

    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollToBottom({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeRoom?.messages]);

    const handleSend = (e) => {
        e.preventDefault();
    }, [activeRoom?.messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput("");
    };

    const filteredMessages = activeRoom?.messages.filter(msg) =>
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
        <div className="flex flex-col h-full brutal-card bg-[#eaed0]/50 dark:bg-charcoal/50 overflow-hidden">
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