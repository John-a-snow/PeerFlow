import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { ProfileContext } from "./ProfileContext";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { username, avatar } = useContext(ProfileContext);
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.DEV
      ? `http://${window.location.hostname}:5000`
      : window.location.origin;

    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setActiveRoom(null);
    });

    socketInstance.on("room:created", (room) => {
      setActiveRoom(room);
      setError(null);
    });

    socketInstance.on("room:joined", (room) => {
      setActiveRoom(room);
      setError(null);
    });

    socketInstance.on("room:join_error", (errMsg) => {
      setError(errMsg);
    });

    socketInstance.on("room:member_joined", ({ socketId, username: newUsername, avatar: newAvatar }) => {
      setActiveRoom((prev) => {
        if (!prev) return null;
        const exists = prev.users.some((u) => u.socketId === socketId);
        if (exists) return prev;
        return {
          ...prev,
          users: [...prev.users, { socketId, username: newUsername, avatar: newAvatar }]
        };
      });
    });

    socketInstance.on("room:member_left", ({ socketId }) => {
      setActiveRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          users: prev.users.filter((u) => u.socketId !== socketId)
        };
      });
    });

    socketInstance.on("chat:message_received", (msg) => {
      setActiveRoom((prev) => {
        if (!prev) return null;
        const exists = prev.messages.some((m) => m.id === msg.id);
        if (exists) return prev;
        return {
          ...prev,
          messages: [...prev.messages, msg]
        };
      });
    });

    socketInstance.on("resource:shared", (res) => {
      setActiveRoom((prev) => {
        if (!prev) return null;
        const exists = prev.resources.some((r) => r.id === res.id);
        if (exists) return prev;
        return {
          ...prev,
          resources: [...prev.resources, res]
        };
      });
    });

    socketInstance.on("room:left", () => {
      setActiveRoom(null);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createRoom = (roomName) => {
    if (!socket || !isConnected) return;
    socket.emit("room:create", { roomName, username, avatar });
  };

  const joinRoom = (roomCode) => {
    if (!socket || !isConnected) return;
    socket.emit("room:join", { roomCode, username, avatar });
  };

  const leaveRoom = () => {
    if (!socket || !activeRoom) return;
    socket.emit("room:leave", { roomCode: activeRoom.code });
  };

  const sendMessage = (content) => {
    if (!socket || !activeRoom) return;
    socket.emit("chat:message", { roomCode: activeRoom.code, content });
  };

  const shareResource = (category, name, content, fileMetadata = null) => {
    if (!socket || !activeRoom) return;
    socket.emit("resource:share", {
      roomCode: activeRoom.code,
      category,
      name,
      content,
      fileMetadata
    });
  };

  const clearError = () => setError(null);

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeRoom,
        error,
        isConnected,
        createRoom,
        joinRoom,
        leaveRoom,
        sendMessage,
        shareResource,
        clearError
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}