import React, { createContext. useState, useEffect, useContext } from "react";
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
         ? `http://$(window.location.hostname):5000`
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
            setIsConnected(true);
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