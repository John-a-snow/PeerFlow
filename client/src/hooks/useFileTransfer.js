import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export function useFileTransfer() {
    const { socket, activeRoom } = useContext(SocketContext);
    const [transfers, setTransfers] = useState({});
    const [incomingRequests, setIncomingRequests] = useState([]);

    const peerConnections = useRef({});
    const dataChannels = useRef({});
    const fileBuffers = useRef({});
    const socketTransferTimers = useRef({});
    const activeFiles = useRef({});    

    useEffect(() => {
        if (!socket) return;

        const handleWebrtcRequest = ({ senderSocketId, fileMetadata }) => {
            activeFiles.current[fileMetadata.transferId] = {
                id: fileMetadata.transferId,
                name: fileMetadata.name,
                size: fileMetadata.size,
                peerId: senderSocketId,
                status: "pending",
                method: "pending"
            };
            
            setIncomingRequests((prev) => {
                const exists = prev.some(r) => r.transferId === fileMetadata.transferId);
                if (exists) return prev;
                return [...prev, { senderSocketId, ...fileMetadata }];
            }];

            setTransfers((prev) => {
               ...prev,
               [fileMetadata.transferId]: (
                id: fileMetadata.transferId,
                name: fileMetadata.name,
                size: fileMetadata.size,
                progress: 0,
                speed: 0,
                status: "pending",
                peerId: senderSocketId,
                method: "pending"
        }
      }));
    };          


     const handleWebrtcAccept = ({ responderSocketId }) => {
      const pendingTransfer = Object.values(activeFiles.current).find(
        (t) => t.peerId === responderSocketId && t.status === "pending"
      );

      if (!pendingTransfer) return;

      initiateWebrtcConnection(pendingTransfer.id, responderSocketId);
    };

    const handleWebrtcDecline = ({ responderSocketId }) => {
      const pendingTransfer = Object.values(activeFiles.current).find(
        (t) => t.peerId === responderSocketId && t.status === "pending"
      );        