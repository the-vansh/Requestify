const express = require("express");
const router = express.Router();
const SongQueue = require("./SongQueue"); 

router.get("/getqueue", async (req, res) => {
    try {
        const { roomCode } = req.query;

        if (!roomCode) {
            return res.status(400).json({ success: false, message: "Room code is required" });
        }

        const queue = await SongQueue.find({ roomCode }).sort({ createdAt: 1 }); // earliest first

        res.status(200).json({ success: true, queue });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
