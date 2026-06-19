import { randomBytes } from "crypto";

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateCode() {
    let code;
    do {
      code = randomBytes(3).toString("hex").toUpperCase();
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(name) {
    const code = this.generateCode();
    const room = {
      code,
      name,
      users: [],
      messages: [],
      resources: []
    };
    this.rooms.set(code, room);
    return room;
  }

  getRoom(code) {
    return this.rooms.get(code.toUpperCase());
  }

  joinRoom(code, socketId, username, avatar) {
    const room = this.getRoom(code);
    if (!room) return null;

    const exists = room.users.some(u => u.socketId === socketId);
    if (!exists) {
      room.users.push({ socketId, username, avatar });
    }
    return room;
  }

  leaveRoom(code, socketId) {
    const room = this.getRoom(code);
    if (!room) return null;

    room.users = room.users.filter(u => u.socketId !== socketId);
    if (room.users.length === 0) {
      this.rooms.delete(code);
      return { code, empty: true };
    }
    return { code, empty: false, room };
  }

  addMessage(code, username, content) {
    const room = this.getRoom(code);
    if (!room) return null;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      content,
      timestamp: new Date().toISOString()
    };
    room.messages.push(message);
    return message;
  }

  addResource(code, category, name, content, fileMetadata, sender) {
    const room = this.getRoom(code);
    if (!room) return null;

    const resource = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      name,
      content,
      fileMetadata,
      sender,
      timestamp: new Date().toISOString()
    };
    room.resources.push(resource);
    return resource;
  }

  removeUserFromAllRooms(socketId) {
    const affectedRooms = [];
    for (const [code, room] of this.rooms.entries()) {
      const userExists = room.users.some(u => u.socketId === socketId);
      if (userExists) {
        const result = this.leaveRoom(code, socketId);
        if (result) {
          affectedRooms.push(result);
        }
      }
    }
    return affectedRooms;
  }
}

export default new RoomManager();
