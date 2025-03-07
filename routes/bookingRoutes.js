const express = require('express');
const Room = require('../model/roomModel');
const Booking = require('../model/bookingModel');

const router = express.Router();

// API lấy danh sách phòng
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy xuất dữ liệu' });
    }
});

// API đặt phòng
router.post('/:id/book', async (req, res) => {
    try {
        const { userId, checkInDate, checkOutDate } = req.body;
        const room = await Room.findById(req.params.id);
        
        if (!room) {
            return res.status(404).json({ message: 'Phòng không tồn tại' });
        }

        if (room.status === 'booked') {
            return res.status(400).json({ message: 'Phòng đã được đặt' });
        }

        const newBooking = await Booking.create({
            roomId: req.params.id,
            userId,
            checkInDate,
            checkOutDate,
            status: 'pending',
        });

        res.status(201).json({ message: 'Yêu cầu đặt phòng đã gửi!', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
});

// API admin duyệt đơn đặt phòng
router.put('/booking/:bookingId/approve', async (req, res) => {
    try {
        const { status } = req.body; // 'approved' hoặc 'rejected'
        const booking = await Booking.findById(req.params.bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: 'Đơn đặt phòng không tồn tại' });
        }

        booking.status = status;
        await booking.save();
        
        if (status === 'approved') {
            await Room.findByIdAndUpdate(booking.roomId, { status: 'booked' });
        }

        res.json({ message: `Đơn đặt phòng đã được ${status}`, booking });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
});

// API lấy danh sách đặt phòng
router.get('/bookings', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const bookings = await Booking.find(filter).populate('userId').populate('roomId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

// API xác nhận đặt phòng
router.put('/booking/:id/confirm', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
        if (!updatedBooking) return res.status(404).json({ message: "Đặt phòng không tồn tại" });

        res.json({ message: "Xác nhận đặt phòng thành công", booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

// API hủy đặt phòng
router.delete('/booking/:id/cancel', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Hủy đặt phòng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

// API lấy lịch sử đặt phòng của user
router.get('/bookings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId })
            .populate('roomId', 'roomNumber type price')
            .sort({ checkIn: -1 });

        if (!bookings.length) {
            return res.status(404).json({ message: "Người dùng chưa có lịch sử đặt phòng nào." });
        }

        res.json({ message: "Lịch sử đặt phòng", bookings });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

module.exports = router;
