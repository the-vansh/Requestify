const mongoose = require("mongoose");

const SongQueueSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    songUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    roomCode: { type: String, required: true }, 
    Vote:{type:Number,default:0},
    Voted_By: [
        {
          userId: { type: String } 
        }
    ],
    addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SongQueue", SongQueueSchema);