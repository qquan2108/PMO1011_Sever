const express = require('express');
const Service = require('../model/serviceModel');

const router = express.Router();

// [RQ11] Quản lý dịch vụ phụ trợ
router.post('/add', async (req, res) => {
    const { name, description, price } = req.body;
    const service = new Service({ name, description, price });
    await service.save();
    res.json({ message: "Dịch vụ mới đã được thêm!" });
});

// [RQ12] Nhận yêu cầu dịch vụ từ khách hàng
router.post('/request', async (req, res) => {
    const { userId, serviceId } = req.body;
    await Service.findByIdAndUpdate(serviceId, { $push: { requests: userId } });
    res.json({ message: "Yêu cầu dịch vụ đã được ghi nhận!" });
});

module.exports = router;