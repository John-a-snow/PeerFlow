import assert from "node:assert";
import roomManager from "./src/state/rooms.js";

try {
  const room = roomManager.createRoom("Test Project Workgroup");
  assert.ok(room.code, "Room code should be generated");
  assert.strictEqual(room.name, "Test Project Workgroup", "Room name should match");

  const fetched = roomManager.getRoom(room.code);
  assert.ok(fetched, "Room should be fetchable by code");
  assert.strictEqual(fetched.name, "Test Project Workgroup");

  const joined = roomManager.joinRoom(room.code, "socket-123", "Alice", "🚀");
  assert.ok(joined, "Join should succeed");
  assert.strictEqual(joined.users.length, 1, "User list count should be 1");
  assert.strictEqual(joined.users[0].username, "Alice");

  const msg = roomManager.addMessage(room.code, "Alice", "Hello LAN!");
  assert.ok(msg.id, "Message should have an ID");
  assert.strictEqual(msg.username, "Alice");
  assert.strictEqual(msg.content, "Hello LAN!");

  const res = roomManager.addResource(room.code, "Notes", "Draft Notes", "Some details here", null, "Alice");
  assert.ok(res.id);
  assert.strictEqual(res.category, "Notes");
  assert.strictEqual(res.name, "Draft Notes");
  assert.strictEqual(res.sender, "Alice");

  const left = roomManager.leaveRoom(room.code, "socket-123");
  assert.ok(left);
  assert.strictEqual(left.empty, true, "Room should be marked empty when last user leaves");

  const cleaned = roomManager.getRoom(room.code);
  assert.strictEqual(cleaned, undefined, "Empty room should be cleaned up from memory");

  console.log("ALL BACKEND ROOM MANAGER TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} catch (error) {
  console.error("TEST SUITE FAILURE:", error);
  process.exit(1);
}
