const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  description: { type: String },
  discount: { type: Number, required: true },  // % giảm giá
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Promotion', promotionSchema);
