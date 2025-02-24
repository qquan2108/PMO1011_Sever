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
    const { userId, rating, comment } = req.body;
    await Room.findByIdAndUpdate(req.params.id, { $push: { reviews: { userId, rating, comment } } });
    res.json({ message: "Đánh giá đã được ghi nhận!" });
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