const express = require("express");
const router = express.Router();
const SongQueue = require("./SongQueue");
const { broadcast } = require("./wss"); 

router.post("/voteup", async (req, res) => {
    const { roomCode, videoId, userId } = req.body;

    if (!roomCode || !videoId || !userId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const song = await SongQueue.findOne({
            roomCode,
            songUrl: { $regex: videoId }
        });

        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        const alreadyVoted = song.Voted_By.some(voter => voter.userId === userId);
        if (alreadyVoted) {
            return res.status(400).json({ success: false, message: "User already voted for this song" });
        }

        song.Vote += 1;
        song.Voted_By.push({ userId });

        await song.save();
        const updatedQueue = await SongQueue.find({ roomCode }).sort({ Vote: -1, addedAt: 1 });
        // Broadcast updated song/votes to all clients in the room
        try{
            broadcast({
                type: "queueUpdate",
                roomCode,
                action: "VOTE_UP",
                song,
                queue: updatedQueue,
            });
       }catch (err) {
      }
        return res.status(200).json({ success: true, message: "Voted up successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;