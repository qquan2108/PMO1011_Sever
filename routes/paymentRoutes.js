const express = require('express');
const Booking = require('../model/bookingModel');
const axios = require('axios');

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

router.post('/verify-transaction', async (req, res) => {
    const { transactionId } = req.body;

    try {
        // Gửi request đến SePay để lấy chi tiết giao dịch
        const response = await axios.get(`https://my.sepay.vn/userapi/transactions/details/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.SEPAY_API_TOKEN}` // Đảm bảo bạn có token API từ SePay
            }
        });

        const transaction = response.data.transaction;

        // Kiểm tra thông tin giao dịch và xác thực
        if (transaction && transaction.status === 200) {
            // Thực hiện các bước xác thực cần thiết
            res.json({ message: 'Giao dịch hợp lệ', transaction });
        } else {
            res.status(400).json({ message: 'Giao dịch không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xác thực giao dịch', error: error.message });
    }
});

router.post('/webhook/transaction', async (req, res) => {
    const transactionData = req.body;

    try {
        // Kiểm tra và xử lý dữ liệu giao dịch từ SePay
        const { id, transferAmount, transferType, referenceCode } = transactionData;

        // Thực hiện các bước xác thực và xử lý giao dịch
        // Ví dụ: kiểm tra tính duy nhất của giao dịch
        const isUniqueTransaction = await checkTransactionUniqueness(id, referenceCode, transferAmount, transferType);
        
        if (isUniqueTransaction) {
            // Xử lý giao dịch hợp lệ
            // Ví dụ: cập nhật trạng thái đơn hàng, lưu thông tin giao dịch vào cơ sở dữ liệu, v.v.
            
            // Phản hồi lại SePay
            res.status(200).json({ success: true });
        } else {
            // Giao dịch trùng lặp hoặc không hợp lệ
            res.status(400).json({ success: false, message: 'Giao dịch không hợp lệ hoặc trùng lặp' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi xử lý Webhook', error: error.message });
    }
});

async function checkTransactionUniqueness(id, referenceCode, transferAmount, transferType) {
    // Kiểm tra tính duy nhất của giao dịch
    // Thực hiện logic kiểm tra tại đây
    return true; // Trả về true nếu giao dịch là duy nhất
}

module.exports = router;