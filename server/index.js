import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import { registerSocketHandlers } from "./src/socket/socketHandler.js";

const PORT 