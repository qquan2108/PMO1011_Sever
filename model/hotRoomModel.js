const mongoose = require('mongoose');

const hotRoomSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    featuredReason: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HotRoom', hotRoomSchema);
