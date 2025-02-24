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

router.put('/:id', async (req, res) => {
    try {
        const { name, email, position } = req.body;
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, { 
            name, email, position 
        }, { new: true });

        if (!updatedStaff) return res.status(404).json({ message: "Nhân viên không tồn tại" });

        res.json({ message: "Cập nhật nhân viên thành công", staff: updatedStaff });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) return res.status(404).json({ message: "Nhân viên không tồn tại" });

        res.json({ message: "Xóa nhân viên thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { code, description, discount, startDate, endDate } = req.body;
        const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, { 
            code, description, discount, startDate, endDate 
        }, { new: true });

        if (!updatedPromotion) return res.status(404).json({ message: "Khuyến mãi không tồn tại" });

        res.json({ message: "Cập nhật khuyến mãi thành công", promotion: updatedPromotion });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!deletedPromotion) return res.status(404).json({ message: "Khuyến mãi không tồn tại" });

        res.json({ message: "Xóa khuyến mãi thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
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

router.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;
        const staffs = await Staff.find({
            $or: [
                { name: new RegExp(keyword, 'i') },
                { email: new RegExp(keyword, 'i') }
            ]
        });
        res.json(staffs);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});


module.exports = router;