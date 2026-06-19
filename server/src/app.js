import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import roomManager from "./state/rooms.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/rooms", (req, res) => {
    const roomsList = Array.from(roomManager.rooms.values()).map((r) => ({
        code: r.code,
        name: r.name,
        usersCount: r.users.length
    }));
    res.json(roomsList);
});

const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("PeerFlow Backend Running. Waiting for client build.");
    }
  });
});

export default app;
