const express = require('express');
const Report = require('../model/reportModel');

const router = express.Router();

// [RQ21] Xem báo cáo doanh thu
router.get('/revenue', async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
});

// [RQ29] Xem thống kê doanh thu theo dịch vụ
router.get('/services', async (req, res) => {
    const serviceReports = await Report.find({ type: "service" });
    res.json(serviceReports);
});

module.exports = router;
