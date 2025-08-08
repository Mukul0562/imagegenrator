const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  businessType: { type: String, required: true },
  goals: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
