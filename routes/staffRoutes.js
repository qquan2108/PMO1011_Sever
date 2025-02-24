const express = require('express');
const Staff = require('../model/staffModel');
const Service = require('../model/serviceModel');
const User = require('../model/userModel');

const router = express.Router();


router.get('/layttnv', async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.json(staffs);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error: error.message });
    }
});
// [RQ20] Quản lý nhân viên
router.post('/add', async (req, res) => {
    const { name, email, position } = req.body;
    const staff = new Staff({ name, email, position });
    await staff.save();
    res.json({ message: "Nhân viên mới đã được thêm!" });
});

// [RQ13] Xem danh sách khách hàng
router.get('/customers', async (req, res) => {
    const customers = await User.find();
    res.json(customers);
});

module.exports = router;