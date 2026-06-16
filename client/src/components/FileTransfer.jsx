import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { Upload, X, Check, Server, Cable } from "lucide-react";

export default function FileTransferPanel({ FileTransferPanel }) {
    const { activeRoom } = useContext(SocketContext);
    const { username } = useContext(ProfileContext);

    const {
        transfers,
        incomingRequests,
        sendFile,
        acceptTransferRequest, 
        declineTransferRequest,
        cancelTransfer
    } = fileTransferState;

    const [selectedTarget, setSelectedTarget] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const activePeers = activeRoom?.users.filter((u) => u.username !== username) || [];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !selectedTarget) return;
        sendFile(file, selectedTarget);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (!file || !selectedTarget) return;
        sendFile(file, selectedTarget);
    };

    const formatSize = (bytes) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    
    const getTargetName = (socketId) => {
        const peer =activeRoom?.users.find((u) => u.socketId === socketId);
        return (peer && peer.username) ? peer.username : "Someone";
    };

    return (
        <div className="h-full overflow-y-auto pr-2 pb-6 space-y-6">
      {incomingRequests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-crimson font-mono">Incoming Transfers</h4>
          <div className="space-y-3">
            {incomingRequests.map((req) => (
              <div key={req.transferId} className="brutal-card border-crimson p-4 flex items-center justify-between bg-white dark:bg-charcoal animate-pulse">
                <div>
                  <p className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50">{req.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1 font-bold">
                    Sender: {getTargetName(req.senderSocketId)} | {formatSize(req.size)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptTransferRequest(req.senderSocketId, req.transferId)}
                    className="p-2.5 bg-cyberGreen border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-xl text-zinc-950 transition-all shrink-0"
                  >
                    <Check className="w-4 h-4 font-bold" />
                  </button>
                  <button
                    onClick={() => declineTransferRequest(req.senderSocketId, req.transferId)}
                    className="p-2.5 bg-white dark:bg-[#1a1a20] border-2 border-black shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-xl text-zinc-650 dark:text-zinc-350 transition-all shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                