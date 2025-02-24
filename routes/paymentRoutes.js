const express = require('express');
const Booking = require('../model/bookingModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const payments = await Payment.find(filter).populate('bookingId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.put('/:id/confirm', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
        if (!updatedPayment) return res.status(404).json({ message: "Thanh toán không tồn tại" });

        res.json({ message: "Xác nhận thanh toán thành công", payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


module.exports = router;