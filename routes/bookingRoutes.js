const express = require('express');
const Booking = require('../model/bookingModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const bookings = await Booking.find(filter).populate('userId').populate('roomId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.put('/:id/confirm', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
        if (!updatedBooking) return res.status(404).json({ message: "Đặt phòng không tồn tại" });

        res.json({ message: "Xác nhận đặt phòng thành công", booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

// [RQ04] Đặt phòng
router.post('/book', async (req, res) => {
    const { userId, roomId, startDate, endDate } = req.body;
    const booking = new Booking({ userId, roomId, startDate, endDate });
    await booking.save();
    res.json({ message: "Đặt phòng thành công!" });
});

// [RQ05] Hủy đặt phòng
router.delete('/cancel/:id', async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Hủy đặt phòng thành công!" });
});

module.exports = router;