const express = require("express");
const router = express.Router();
const Room = require("./Roomschema");
const SongQueue = require("./SongQueue"); 

router.post("/deleteroom", async (req, res) => {
    try {
        const { roomCode } = req.body;

        const room = await Room.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        // Delete the room
        await Room.deleteOne({ roomCode });

        // Delete all songs belonging to this room
        await SongQueue.deleteMany({ roomCode });

        return res.status(200).json({ success: true, message: "Room and associated songs deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;