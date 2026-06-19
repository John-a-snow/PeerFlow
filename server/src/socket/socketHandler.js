import roomManager from "../state/rooms.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("room:create", ({ roomName, username, avatar }) => {
      const room = roomManager.createRoom(roomName);
      roomManager.joinRoom(room.code, socket.id, username, avatar);
      socket.join(room.code);
      socket.emit("room:created", room);
    });

    socket.on("room:join", ({ roomCode, username, avatar }) => {
      const formattedCode = roomCode.trim().toUpperCase();
      const room = roomManager.getRoom(formattedCode);
      if (!room) {
        socket.emit("room:join_error", "Room not found");
        return;
      }

      roomManager.joinRoom(formattedCode, socket.id, username, avatar);
      socket.join(formattedCode);
      socket.emit("room:joined", room);
      socket.to(formattedCode).emit("room:member_joined", {
        socketId: socket.id,
        username,
        avatar
      });
    });

    socket.on("room:leave", ({ roomCode }) => {
      const formattedCode = roomCode.trim().toUpperCase();
      const room = roomManager.getRoom(formattedCode);
      if (!room) return;

      const user = room.users.find((u) => u.socketId === socket.id);
      const username = user ? user.username : "Someone";

      socket.leave(formattedCode);
      const result = roomManager.leaveRoom(formattedCode, socket.id);
      socket.emit("room:left");

      if (result && !result.empty) {
        socket.to(formattedCode).emit("room:member_left", {
          socketId: socket.id,
          username
        });
      }
    });

    socket.on("chat:message", ({ roomCode, content }) => {
      const formattedCode = roomCode.trim().toUpperCase();
      const room = roomManager.getRoom(formattedCode);
      if (!room) return;

      const user = room.users.find((u) => u.socketId === socket.id);
      if (!user) return;

      const message = roomManager.addMessage(formattedCode, user.username, content);
      if (message) {
        io.to(formattedCode).emit("chat:message_received", message);
      }
    });

    socket.on("resource:share", ({ roomCode, category, name, content, fileMetadata }) => {
      const formattedCode = roomCode.trim().toUpperCase();
      const room = roomManager.getRoom(formattedCode);
      if (!room) return;

      const user = room.users.find((u) => u.socketId === socket.id);
      if (!user) return;

      const resource = roomManager.addResource(
        formattedCode,
        category,
        name,
        content,
        fileMetadata,
        user.username
      );
      if (resource) {
        io.to(formattedCode).emit("resource:shared", resource);
      }
    });

    socket.on("webrtc:request", ({ roomCode, targetSocketId, fileMetadata }) => {
      io.to(targetSocketId).emit("webrtc:request", {
        senderSocketId: socket.id,
        fileMetadata
      });
    });

    socket.on("webrtc:accept", ({ roomCode, targetSocketId }) => {
      io.to(targetSocketId).emit("webrtc:accept", {
        responderSocketId: socket.id
      });
    });

    socket.on("webrtc:decline", ({ roomCode, targetSocketId }) => {
      io.to(targetSocketId).emit("webrtc:decline", {
        responderSocketId: socket.id
      });
    });

    socket.on("webrtc:signal", ({ targetSocketId, signalData }) => {
      io.to(targetSocketId).emit("webrtc:signal", {
        senderSocketId: socket.id,
        signalData
      });
    });

    socket.on("file:chunk", ({ targetSocketId, chunk, fileName, chunkIndex, totalChunks, transferId }) => {
      io.to(targetSocketId).emit("file:chunk", {
        senderSocketId: socket.id,
        chunk,
        fileName,
        chunkIndex,
        totalChunks,
        transferId
      });
    });

    socket.on("file:cancel", ({ targetSocketId, transferId }) => {
      io.to(targetSocketId).emit("file:cancel", {
        senderSocketId: socket.id,
        transferId
      });
    });

    socket.on("disconnect", () => {
      const affectedRooms = roomManager.removeUserFromAllRooms(socket.id);
      affectedRooms.forEach(({ code, empty, room }) => {
        if (!empty) {
          socket.to(code).emit("room:member_left", {
            socketId: socket.id,
            username: "Someone"
          });
        }
      });
    });
  });
}
