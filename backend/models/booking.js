const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  gear: [{ type: String, required: true }], // Changed to store gear names
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  timeFrom: { type: String },
  timeTo: { type: String },
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
