const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'cleaning'], default: 'available' },
    imageUrl: { type: String } // Thêm trường imageUrl
});
module.exports = mongoose.model('Room', roomSchema);