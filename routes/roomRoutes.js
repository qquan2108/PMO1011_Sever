const express = require('express');
const Room = require('../model/roomModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi truy xuất dữ liệu' });
    }
  });

router.post('/', async (req, res) => {
    const { roomNumber, type, price, status, imageUrl } = req.body;
    
    // Kiểm tra nếu đã tồn tại phòng có cùng số phòng
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) return res.status(400).json({ message: 'Phòng đã tồn tại' });

    try {
        const newRoom = await Room.create({
            roomNumber,
            type,
            price,
            status,
            imageUrl
        });
        
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo phòng' });
    }
});

// [RQ03] Xem thông tin phòng
router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id);
    res.json(room);
});

router.put('/:id', async (req, res) => {
    try {
        const { roomNumber, type, price, status, imageUrl } = req.body;
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { 
            roomNumber, type, price, status, imageUrl 
        }, { new: true });

        if (!updatedRoom) return res.status(404).json({ message: "Phòng không tồn tại" });

        res.json({ message: "Cập nhật phòng thành công", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: "Phòng không tồn tại" });

        res.json({ message: "Xóa phòng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

// [RQ08] Đánh giá phòng
router.post('/:id/review', async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;

        // Kiểm tra dữ liệu đầu vào hợp lệ
        if (!userId || !rating || !comment) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin (userId, rating, comment)" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
        }

        // Kiểm tra phòng có tồn tại không
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        // Thêm review mới vào danh sách reviews
        room.reviews.push({ userId, rating, comment });
        await room.save();

        res.json({ message: "Đánh giá đã được ghi nhận!", room });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.get('/:id/reviews', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("reviews.userId", "name email");
        if (!room) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        res.json(room.reviews);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.delete('/:roomId/review/:reviewId', async (req, res) => {
    try {
        const { roomId, reviewId } = req.params;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Phòng không tồn tại" });
        }

        // Lọc ra danh sách đánh giá không chứa review bị xóa
        room.reviews = room.reviews.filter(review => review._id.toString() !== reviewId);
        await room.save();

        res.json({ message: "Xóa đánh giá thành công", room });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['available', 'booked', 'cleaning'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: "Phòng không tồn tại" });

        res.json({ message: "Cập nhật trạng thái phòng thành công", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


// [RQ22] Cập nhật chính sách giá phòng
router.put('/:id/price', async (req, res) => {
    const { price } = req.body;
    await Room.findByIdAndUpdate(req.params.id, { price });
    res.json({ message: "Giá phòng đã được cập nhật!" });
});

module.exports = router;