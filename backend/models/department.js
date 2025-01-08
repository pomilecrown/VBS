const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.models.Department || mongoose.model('Department', departmentSchema);
