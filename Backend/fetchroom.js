const express = require("express");
const router = express.Router();
const Room = require('./Roomschema'); 

router.post("/getuserroom", async (req, res) => {
    const { userId } = req.body;
    try {
        const room = await Room.findOne({ admin: userId });
        if (room) {
            return res.json({ roomCode: room.roomCode });
        }
        res.json({ roomCode: null });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
