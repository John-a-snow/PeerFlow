import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { Search, FolderOpen, FileText, Link, Plus, X } from "lucide-react";

const CATEGORIES = ["Notes", "Assignments", "Presentations", "Resources", "Project Files"];

export default function ResourceHub() {
  const { activeRoom, shareResource } = useContext(SocketContext);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [resType, setResType] = useState("note");
  const [resName, setResName] = useState("");
  const [resCategory, setResCategory] = useState("Notes");
  const [resContent, setResContent] = useState("");

  const handleShare = (e) => {
    e.preventDefault();
    if (!resName.trim()) return;

    if (resType === "note") {
      shareResource(resCategory, resName.trim(), resContent.trim());
    } else {
      shareResource(resCategory, resName.trim(), "", { url: resContent.trim() });
    }

    setResName("");
    setResContent("");
    setShowAddModal(false);
  };

  const filteredResources = activeRoom?.resources.filter((res) => {
    const matchesTab = activeTab === "All" || res.category === activeTab;
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 brutal-input text-sm"
            placeholder="Search notes, links, or creators..."
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 py-3 px-4 brutal-btn text-sm font-bold uppercase tracking-wider shrink-0"
        >
          <Plus className="w-4 h-4" /> Share Resource
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-black dark:border-zinc-700">
        <button
          onClick={() => setActiveTab("All")}
          className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "All"
              ? "bg-crimson/10 border-crimson text-crimson shadow-flatHover translate-x-[1px] translate-y-[1px]"
              : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-zinc-50 shadow-flatHover hover:bg-zinc-150 dark:hover:bg-zinc-800"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === cat
                ? "bg-crimson/10 border-crimson text-crimson shadow-flatHover translate-x-[1px] translate-y-[1px]"
                : "bg-white dark:bg-[#1a1a20] text-zinc-950 dark:text-zinc-50 shadow-flatHover hover:bg-zinc-150 dark:hover:bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto pr-1">
        {filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 font-mono text-xs uppercase font-bold gap-3">
            <FolderOpen className="w-10 h-10 text-zinc-400" />
            <span>No resources shared yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => {
              const isNote = !res.fileMetadata?.url;
              return (
                <div
                  key={res.id}
                  onClick={() => {
                    if (isNote) setSelectedNote(res);
                  }}
                  className={`brutal-card p-4 flex items-start gap-4 transition-all hover:border-crimson bg-white/40 dark:bg-charcoal/40 ${
                    isNote ? "cursor-pointer" : ""
                  }`}
                >
                  <div className={`p-3 border-2 border-black rounded-xl shadow-flatHover shrink-0 ${
                    isNote ? "bg-crimson/10 dark:bg-crimson/20 text-crimson" : "bg-cyberGreen/10 dark:bg-cyberGreen/20 text-cyberGreen"
                  }`}>
                    {isNote ? <FileText className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                  </div>

                  