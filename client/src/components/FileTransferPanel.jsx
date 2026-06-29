import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ProfileContext } from "../context/ProfileContext";
import { Upload, X, Check, Server, Cable } from "lucide-react";

export default function FileTransferPanel({ fileTransferState }) {
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
    const peer = activeRoom?.users.find((u) => u.socketId === socketId);
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
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="brutal-card p-6 md:p-8 space-y-4 bg-white/40 dark:bg-charcoal/40">
        <div>
          <h3 className="font-extrabold text-lg uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Send Payload</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Stream data packets directly to online peers.</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block font-mono">Receiver Node</label>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full brutal-input bg-white dark:bg-[#1a1a20] cursor-pointer"
          >
            <option value="">-- Choose active peer --</option>
            {activePeers.map((peer) => (
              <option key={peer.socketId} value={peer.socketId}>
                {peer.username}
              </option>
            ))}
          </select>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-4 border-dashed rounded-2xl p-10 text-center transition-all ${
            !selectedTarget
              ? "border-zinc-300 opacity-40 cursor-not-allowed"
              : dragOver
              ? "border-crimson bg-crimson/5 cursor-pointer"
              : "border-black dark:border-zinc-700 hover:border-zinc-800 dark:hover:border-zinc-500 bg-white/40 dark:bg-[#1a1a20]/40 cursor-pointer"
          }`}
        >
          <input
            type="file"
            id="file-input"
            disabled={!selectedTarget}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor={selectedTarget ? "file-input" : ""}
            className={`flex flex-col items-center gap-3 ${selectedTarget ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            <Upload className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
            <div>
              <p className="font-extrabold text-sm text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">Drag & Drop Payload</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">or click to open file explorer</p>
            </div>
          </label>
        </div>
      </div>

      {Object.keys(transfers).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-550 dark:text-zinc-400 font-mono">Active Pipelines</h4>
          <div className="space-y-3">
            {Object.values(transfers)
              .reverse()
              .map((t) => {
                const isUpload = t.type === "upload";
                const isPending = t.status === "pending" || t.status === "connecting";
                const isCompleted = t.status === "completed";
                const isFailed = t.status === "failed" || t.status === "cancelled" || t.status === "declined";

                return (
                  <div key={t.id} className="brutal-card p-4 space-y-3 bg-white/40 dark:bg-charcoal/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 border border-black rounded-lg text-[9px] font-mono uppercase font-bold mb-2 ${
                          isUpload ? "bg-crimson/10 text-crimson" : "bg-cyberGreen/10 text-cyberGreen"
                        }`}>
                          {isUpload ? "Upload" : "Download"}
                        </span>
                        <h5 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50 break-all">{t.name}</h5>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1 font-bold">
                          Size: {formatSize(t.size)} | Peer: {getTargetName(t.peerId)}
                        </p>
                      </div>

                      {!isCompleted && !isFailed && (
                        <button
                          onClick={() => cancelTransfer(t.id)}
                          className="p-1.5 bg-white dark:bg-[#1a1a20] border-2 border-black hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span className="text-zinc-550 dark:text-zinc-400 uppercase">
                          {t.status === "pending" && "Ready! Waiting for approval..."}
                          {t.status === "connecting" && "Hooking signal..."}
                          {t.status === "transferring" && `${t.progress}%`}
                          {isCompleted && "Completed"}
                          {t.status === "declined" && "Declined"}
                          {t.status === "cancelled" && "Cancelled"}
                          {t.status === "failed" && "Failed"}
                        </span>
                        {t.status === "transferring" && t.speed > 0 && (
                          <span className="text-zinc-700 dark:text-zinc-300">{t.speed} MB/s</span>
                        )}
                        {t.status === "transferring" && (
                          <span className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                            {t.method === "webrtc" ? (
                              <>
                                <Cable className="w-3 h-3 text-crimson animate-pulse" /> P2P
                              </>
                            ) : (
                              <>
                                <Server className="w-3 h-3 text-[#ff9e42] animate-pulse" /> Socket
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="h-3 w-full bg-[#eae0d0] dark:bg-[#1a1a20] border-2 border-black rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isCompleted
                              ? "bg-cyberGreen"
                              : isFailed
                              ? "bg-zinc-300"
                              : isPending
                              ? "bg-crimson/30 animate-pulse"
                              : "bg-[#ff9e42]"
                          }`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
