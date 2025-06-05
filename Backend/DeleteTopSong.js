const express = require("express");
const router = express.Router();
const SongQueue = require("./SongQueue");
const { broadcast } = require("./wss");
router.post("/removesong", async (req, res) => {
    const { roomCode, videoId } = req.body;

    try {
        await SongQueue.deleteOne({ roomCode, songUrl: { $regex: videoId } });
        res.json({ success: true });

       const updatedQueue = await SongQueue.find({ roomCode }).sort({ Vote: -1, addedAt: 1 });

       // Broadcast updated queue to clients
        try {
        broadcast({
            type: "queueUpdate", 
            roomCode,
            queue: updatedQueue,
        });
        } catch (err) {

        }

    } catch (err) {

        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
module.exports = router;