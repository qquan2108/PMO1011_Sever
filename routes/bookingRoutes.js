const express = require('express');
const Booking = require('../model/bookingModel');

const router = express.Router();

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