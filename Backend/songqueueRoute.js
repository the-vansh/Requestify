const express = require("express");
const router = express.Router();
const SongQueue = require("./SongQueue");
const Room = require("./Roomschema");
const { broadcast } = require("./wss"); 

// POST /addsong
router.post("/addsong", async (req, res) => {
  try {
    const { songName, songUrl, thumbnail, roomCode } = req.body;

    
    if (!songName || !songUrl || !thumbnail || !roomCode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }


    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room does not exist" });
    }

   
    const newSong = new SongQueue({ songName, songUrl, thumbnail, roomCode });
    await newSong.save();

  
    const updatedQueue = await SongQueue.find({ roomCode }).sort({ Vote: -1, addedAt: 1 });

   
    try {
      broadcast({
        type: "queueUpdate", 
        roomCode,
        queue: updatedQueue,
      });
    } catch (err) {
    }

    res.status(201).json({ success: true, message: "Song added to queue" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;