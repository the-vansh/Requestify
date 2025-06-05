const express = require("express");
const router = express.Router();
const Room = require("./Roomschema"); 

// Create a new room
router.post("/createroom", async (req, res) => {
    try {
        const { roomName, roomCode, admin } = req.body;

        if (!roomName || !roomCode || !admin) {
            return res.status(400).json({ message: "Missing required fields" });
        }

       
        const newRoom = new Room({ roomName, roomCode, admin });
        await newRoom.save();

        res.status(201).json({ success: true, message: "Room created successfully", roomCode });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
