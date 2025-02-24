const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked', 'cleaning'], default: 'available' },
    imageUrl: { type: String },
    reviews: [reviewSchema] // Thay vì `review: String`, sửa thành mảng chứa nhiều review
});

module.exports = mongoose.model('Room', roomSchema);
