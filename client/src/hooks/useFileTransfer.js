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
        const exists = prev.some((r) => r.transferId === fileMetadata.transferId);
        if (exists) return prev;
        return [...prev, { senderSocketId, ...fileMetadata }];
      });

      setTransfers((prev) => ({
        ...prev,
        [fileMetadata.transferId]: {
          id: fileMetadata.transferId,
          name: fileMetadata.name,
          size: fileMetadata.size,
          progress: 0,
          speed: 0,
          status: "pending",
          type: "download",
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

      if (!pendingTransfer) return;

      setTransfers((prev) => ({
        ...prev,
        [pendingTransfer.id]: {
          ...prev[pendingTransfer.id],
          status: "declined"
        }
      }));
    };

    const handleWebrtcSignal = ({ senderSocketId, signalData }) => {
      const { transferId, sdp, candidate } = signalData;
      const pc = peerConnections.current[transferId];

      if (!pc) {
        setupReceiverPeerConnection(transferId, senderSocketId, signalData);
        return;
      }

      if (sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => {
            if (sdp.type === "offer") {
              pc.createAnswer().then((answer) => {
                pc.setLocalDescription(answer);
                socket.emit("webrtc:signal", {
                  targetSocketId: senderSocketId,
                  signalData: { transferId, sdp: answer }
                });
              });
            }
          })
          .catch(() => {});
      } else if (candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      }
    };

    const handleFileChunk = ({ senderSocketId, chunk, fileName, chunkIndex, totalChunks, transferId }) => {
      if (!fileBuffers.current[transferId]) {
        fileBuffers.current[transferId] = [];
        setTransfers((prev) => ({
          ...prev,
          [transferId]: {
            id: transferId,
            name: fileName,
            size: activeFiles.current[transferId]?.size || 0,
            progress: 0,
            speed: 0,
            status: "transferring",
            type: "download",
            peerId: senderSocketId,
            method: "socket"
          }
        }));
      }

      fileBuffers.current[transferId].push(chunk);

      const bufferCount = fileBuffers.current[transferId].length;
      const progress = Math.round((bufferCount / totalChunks) * 100);

      setTransfers((prev) => {
        const current = prev[transferId];
        if (!current) return prev;
        return {
          ...prev,
          [transferId]: {
            ...current,
            progress,
            method: "socket",
            status: progress === 100 ? "completed" : "transferring"
          }
        };
      });

      if (bufferCount === totalChunks) {
        assembleAndDownloadFile(transferId, fileName);
      }
    };

    const handleFileCancel = ({ transferId }) => {
      cleanupTransfer(transferId, "cancelled");
    };

    socket.on("webrtc:request", handleWebrtcRequest);
    socket.on("webrtc:accept", handleWebrtcAccept);
    socket.on("webrtc:decline", handleWebrtcDecline);
    socket.on("webrtc:signal", handleWebrtcSignal);
    socket.on("file:chunk", handleFileChunk);
    socket.on("file:cancel", handleFileCancel);

    return () => {
      socket.off("webrtc:request", handleWebrtcRequest);
      socket.off("webrtc:accept", handleWebrtcAccept);
      socket.off("webrtc:decline", handleWebrtcSignal);
      socket.off("webrtc:signal", handleWebrtcSignal);
      socket.off("file:chunk", handleFileChunk);
      socket.off("file:cancel", handleFileCancel);
    };
  }, [socket]);

  const initiateWebrtcConnection = (transferId, targetSocketId) => {
    const file = activeFiles.current[transferId]?.file;
    if (!file) return;

    if (activeFiles.current[transferId]) {
        activeFiles.current[transferId].status = "connecting";
        activeFiles.current[transferId].method = "webrtc";
    }

    setTransfers((prev) => ({
        ...prev,
        [transferId]: {
            status: "connecting",
            method: "webrtc"
        }
    }));

    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.1.google.com:19302"}
        ]
    });
 
    peerConnections.current[transferId] = pc;

    const channel = pc.createDataChannel(`file-channel-${transferId}`);
    dataChannels.current[transferId] = channel;

    channel.binaryType = "arraybuffer";

    let connectionTimeout = setTimeout(() => {
      const active = activeFiles.current[transferId];
      if (!active || active.status !== "transferring") {
        startSocketFallback(transferId, targetSocketId);
      }
    }, 6000);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:signal", {
          targetSocketId,
          signalData: { transferId, candidate: event.candidate }
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        clearTimeout(connectionTimeout);
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        startSocketFallback(transferId, targetSocketId);
      }
    };

    channel.onopen = () => {
      clearTimeout(connectionTimeout);
      setTransfers((prev) => {
        ...prev,
        [transferId]: {
          ...prev[transferId],
          status: "transferring"
        }
      }));
      senderWebrtcFileChunks(transferId, file, channel);
    };

    channel.onclose = () => {
      if (
        activeFiles.current[transferId] &&
        activeFiles.current[transferId].status !== "completed"
      ) {
        startSocketFallback(transferId, targetSocketId);
      }
    };
    
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        socket.emit("webrtc:signal", {
          targetSocketId,
          signalData: { transferId, sdp: pc.localDescription }
        });
      })
      .catch(() => {
        startsSocketFallback(transferId, targetSocketId);
      });
  };

  const setupRecieverPeerConnection = (transferId, senderSocketId, signalData) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]
    });

    peerConnections.current[transferId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:signal", {
          targetSocketId: senderSocketId,
          signalData: { transferId, candidate: event.candidate }
        });
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      dataChannels.current[transferId] = channel;
      channel.binaryType = "arraybuffer";

      fileBuffers.current[transferId] = [];

      let receivedBytes = 0;
      let startTime = Date.now();

      channel.onmessage = (e) => {
        const buffer = e.data;
        fileBuffers.current[transferId].push(buffer);
        receivedBytes += buffer.byteLength;

        const metadata = activeFiles.current[transferId];
        const totalSize = metadata ? metadata.size : 0;
        const fileName = metadata ? metadata.name : "file";

        const progress = totalSize > 0 ? Math.round((receivedBytes / totalSize) * 100) : 0;

        const duration = (Date.now() - startTime) / 1000;
        const speed = duration > 0 ? Math.round(receivedBytes / duration / 1024 / 1024 * 10) / 10 : 0;

        setTransfers((prev) => {
          const current = prev[transferId];
          if (!current) return prev;
          return {
            ...prev, 
            [transferId]: {
              ...current,
              progress,
              speed,
              status: progress === 100 ? "completed" : "transfering"
            }
          };
        });

        if (totalSize > 0 && receivedBytes >= totalSize) {
          assembleAndDownloadFile(transferId, fileName);
          channel.close();
          pc.close();
        }
      };
    };

    if (signalData.sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp))
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(() => {
          socket.emit("webrtc:signal", {
            targetSocketId: senderSocketId,
            signalData: { transferId, sdp: pc.localDescription }
          });
        })
        .catch(() => {});
    }
  };

  const sendWebrtcFileChunks = (transferId, file, channel) => {
    const chunkSize = 16384;
    let offset = 0;
    const fileReader = new FileReader();
    const startTime = DataTransfer.now();

    const readSlice = () => {
      if (!channel || channel.readyState !== "open") return;
      const slice = file.slice(offset, offset + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    fileReader.onload = (e) => {
      const buffer = e.target.result;
      try {
        channel.send(buffer);
        try {
          channel.send(buffer);
          offset += buffer.byteLength;

          const progress = Math.round((offset / file.size) * 100);
          const duration = (Date.now() - startTime) / 1000;
          const speed = duration > 0 ? Math.round(offset / duration / 1024 / 1024 * 10) / 10 : 0;

          setTransfers((prev) => {
            const current = prev[transferId];
            if (!current) return prev;
            return {
              ...prev,
              [transferId]: {
                ...current,
                progress,
                speed,
                status: progress === 100 ? "completed" : "transferring"
              }
            };
          });

          if (offset < file.size) {
            if (channel.bufferedAmount > 65535) {
              channel.onbufferedAmountlow = () => {
                channel.onbufferedAmountlow = null;
                readSlice();
              };
            } else {
                         readSlice();
          }
        } else {
          cleanupTransfer(transferId, "completed");
        }
      } catch (err) {
        startSocketFallback(transferId, transfers[transferId]?.peerId);
      }
    };

    readSlice();
  };

    const startSocketFallback = (transferId, targetSocketId) => {
    const active = activeFiles.current[transferId];
    if (
      active?.method === "socket" ||
      active?.status === "completed"
    ) {
      return;
    }



    
    

