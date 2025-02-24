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