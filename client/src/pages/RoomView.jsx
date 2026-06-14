import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { ThemeContext } from "../context/ThemeContext";
import Chat from "../components/Chat";
import FileTransferPanel from "../components/FileTransferPanel";
import ResourceHub from "../components/ResourceHub";
import QRJoin from "../components/QRJoin";
import { LogOut, Copy, Check, Users, MessageSquare, Share2, FolderHeart, QrCode, Sun, Moon } from "lucide-react";

export default function RoomView() {
    const{ activeRoom, leaveRoom } = useContext(SocketContext);
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
   
