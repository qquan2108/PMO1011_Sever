const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['credit card', 'paypal', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
});

module.exports = mongoose.model('Payment', paymentSchema);

