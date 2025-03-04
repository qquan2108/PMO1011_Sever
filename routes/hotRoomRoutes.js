const express = require('express');
const HotRoom = require('../model/hotRoomModel');
const Room = require('../model/roomModel');

const router = express.Router();

// Lấy danh sách phòng nổi bật
router.get('/', async (req, res) => {
    try {
        const hotRooms = await HotRoom.find().populate('roomId');
        res.json(hotRooms);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng nổi bật', error: error.message });
    }
});

// Thêm một phòng nổi bật
router.post('/', async (req, res) => {
    try {
        const { roomId, featuredReason } = req.body;
        const existingRoom = await Room.findById(roomId);
        if (!existingRoom) return res.status(404).json({ message: 'Phòng không tồn tại' });
        
        const newHotRoom = new HotRoom({ roomId, featuredReason });
        await newHotRoom.save();
        res.status(201).json(newHotRoom);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm phòng nổi bật', error: error.message });
    }
});

// Cập nhật thông tin phòng nổi bật
router.put('/:id', async (req, res) => {
    try {
        const { featuredReason } = req.body;
        const updatedHotRoom = await HotRoom.findByIdAndUpdate(req.params.id, { featuredReason }, { new: true });
        if (!updatedHotRoom) return res.status(404).json({ message: 'Phòng nổi bật không tồn tại' });
        
        res.json({ message: 'Cập nhật thành công', hotRoom: updatedHotRoom });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
});

// Xóa phòng nổi bật
router.delete('/:id', async (req, res) => {
    try {
        const deletedHotRoom = await HotRoom.findByIdAndDelete(req.params.id);
        if (!deletedHotRoom) return res.status(404).json({ message: 'Phòng nổi bật không tồn tại' });
        
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
});

module.exports = router;
