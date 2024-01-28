const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  audience: {
    gender: String,
    level: String,
    religion: String,
    department: String,
    residence: String,
    stateOfOrigin: String,
  },
  reach: Number,
  platform: String,
  senderId: String,
  adContent: String,
  bill: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamps: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: null },
    paid: { type: Date, default: null },
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'canceled'],
    default: 'pending',
  },
  paid: { type: Boolean, default: false },
  webhookUrl: String,
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
