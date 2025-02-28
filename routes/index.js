var express = require('express');
var router = express.Router();
const Room = require('../model/roomModel');

// Xem phòng nổi bật (lấy 5 phòng có đánh giá cao nhất)
router.get('/featured-rooms', async (req, res) => {
    try {
        const rooms = await Room.find().sort({ rating: -1 }).limit(5); // Giả định có trường rating
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng nổi bật', error: error.message });
    }
});

// Xem đánh giá của một phòng cụ thể
router.get('/rooms/:id/reviews', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });

        res.json(room.reviews || []); // Giả định có mảng reviews trong schema Room
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá phòng', error: error.message });
    }
});

module.exports = router;
