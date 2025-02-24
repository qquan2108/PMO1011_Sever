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

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra userId có hợp lệ không
        const bookings = await Booking.find({ userId })
            .populate('roomId', 'roomNumber type price') // Lấy thông tin phòng
            .sort({ checkIn: -1 }); // Sắp xếp theo ngày check-in mới nhất

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "Người dùng chưa có lịch sử đặt phòng nào." });
        }

        res.json({ message: "Lịch sử đặt phòng", bookings });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.get('/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .populate('userId', 'name email')
            .populate('roomId', 'roomNumber type price');

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng." });
        }

        res.json({ message: "Chi tiết đơn đặt phòng", booking });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.get('/:userId/status/:status', async (req, res) => {
    try {
        const { userId, status } = req.params;

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['pending', 'confirmed', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ." });
        }

        const bookings = await Booking.find({ userId, status })
            .populate('roomId', 'roomNumber type price')
            .sort({ checkIn: -1 });

        if (!bookings.length) {
            return res.status(404).json({ message: `Không có đơn đặt phòng nào với trạng thái: ${status}` });
        }

        res.json({ message: `Danh sách đơn đặt phòng có trạng thái ${status}`, bookings });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


module.exports = router;