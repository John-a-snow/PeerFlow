import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { Search, FolderOpen, FileText, Link, Plus, X } from "lucide-react";

const CATEGORIES = ["Notes", "Assignments", "Presentations", "Resources", "Project Files"];

export default function ResourceHub() {
  const { activeRoom, shareResource } = useContext(SocketContext);
    
  const [activeTab, seActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(null);
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
    const.matchesTab = activeTab === "All" || res.resCategory === activeTab;
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
        ></button>    