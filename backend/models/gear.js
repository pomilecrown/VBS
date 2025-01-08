const mongoose = require('mongoose');

const gearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  available: { type: Boolean, default: true },
});

// Use existing model if it exists, otherwise create a new model
module.exports = mongoose.models.Gear || mongoose.model('Gear', gearSchema);
