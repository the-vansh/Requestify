const express = require("express");
const router = express.Router();
const SongQueue = require("./SongQueue");
const { broadcast } = require("./wss"); 

router.post("/emptyqueue", async (req, res) => {
  try {
    const { roomCode } = req.body;
    if (!roomCode) {
      return res.status(400).json({ success: false, message: "Room code is required" });
    }

    await SongQueue.deleteMany({ roomCode });

    // Broadcast queue update to clients
    broadcast({
      type: "queueUpdate",
      roomCode,
      queue: [], // queue is now empty
    });

    res.json({ success: true, message: "Queue emptied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;