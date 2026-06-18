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
                  
                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-mono">
                    <h4 className="font-extrabold text-sm truncate mt-0.5 text-zinc-950 dark:text-zinc-50">{res.name}</h4>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1 font-bold">Shared by {res.sender}</p>

                    {!isNote && (
                      <a
                        href={res.fileMetadata.url.startsWith("hhtp") ? res.fileMetadata.url : "https://${res.fillMetadata.url}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-cyberGreen hover:text-cyberGreen-light font-bold mt-3 transition-colors"
                      >
                        Visit Link &rarr;
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md brutal-card p-6 space-y-6 bg-white dark:bg-[#16161a] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg uppercase tracking-wider">Share Resource</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-white/5 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-lg text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleShare} className="space-y-4">
                <div className="flex bg-[#eae0d0] dark:bg-[#1a1a20] p-1 border-2 border-black rounded-xl">
                <button
                  type="button"
                  onClick={() => setResType("note")}
                  className={`flex-grow py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    resType === "note" ? "bg-white dark:bg-charcoal text-zinc-950 dark:text-white" : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Document Note
                </button>
                <button
                  type="button"
                  onClick={() => setResType("link")}
                  className={`flex-grow py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    resType === "link" ? "bg-white dark:bg-charcoal text-zinc-950 dark:text-white" : "text-zinc-555 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  External Link
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Resource Name</label>
                <input
                  type="text"
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full brutal-input"
                  placeholder={resType === "note" ? "e.g. Server setup steps" : "e.g. Repo Link"}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block font-mono">Category</label>
                <select
                  value={resCategory}
                  onChange={(e) => setResCategory(e.target.value)}
                  className="w-full brutal-input bg-white dark:bg-[#1a1a20] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>