const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  revenue: { type: Number, required: true },
  roomBookings: { type: Number, required: true },
  servicesUsed: { type: Number, required: true }
});

module.exports = mongoose.model('Report', reportSchema);
