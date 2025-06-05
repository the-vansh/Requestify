const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    roomCode: { type: String, required: true, unique: true },
    admin: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
