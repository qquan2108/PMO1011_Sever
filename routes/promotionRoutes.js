const express = require('express');
const Promotion = require('../model/promotionModel');

const router = express.Router();

router.get('/layttvc', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách khuyến mãi", error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { code, description, discount, startDate, endDate } = req.body;

        // Kiểm tra nếu mã khuyến mãi đã tồn tại
        const existingPromotion = await Promotion.findOne({ code });
        if (existingPromotion) {
            return res.status(400).json({ message: "Mã khuyến mãi đã tồn tại" });
        }

        const newPromotion = new Promotion({
            code,
            description,
            discount,
            startDate,
            endDate
        });

        await newPromotion.save();
        res.status(201).json({ message: "Thêm khuyến mãi thành công", promotion: newPromotion });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { code, description, discount, startDate, endDate } = req.body;

        const updatedPromotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            { code, description, discount, startDate, endDate },
            { new: true }
        );

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


// [RQ27] Quản lý chương trình khuyến mãi
router.post('/add', async (req, res) => {
    const { name, discount, description } = req.body;
    const promotion = new Promotion({ name, discount, description });
    await promotion.save();
    res.json({ message: "Khuyến mãi đã được thêm!" });
});

// [RQ09] Nhận thông báo khuyến mãi
router.get('/notify/:userId', async (req, res) => {
    const promotions = await Promotion.find();
    res.json(promotions);
});

module.exports = router;