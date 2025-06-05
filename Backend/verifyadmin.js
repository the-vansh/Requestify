const express = require("express");
const router = express.Router();
const Room = require("./Roomschema"); 

router.post("/verifyadmin", async (req, res) => {
    try {
        const { userId, roomCode } = req.body;

        if (!userId || !roomCode) {
            return res.status(400).json({ success: false, message: "User ID and Room Code are required" });
        }

        // Check if this user is the admin of this specific room
        const room = await Room.findOne({ admin: userId, roomCode: roomCode });

        if (room) {
            return res.json({ success: true, isAdmin: true });
        } else {
            return res.json({ success: true, isAdmin: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
