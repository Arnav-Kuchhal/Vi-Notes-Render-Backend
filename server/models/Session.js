const mongoose = require('mongoose');

const KeystrokeSchema = new mongoose.Schema({
  t: { type: Number, required: true }, // timestamp
  dt: { type: Number, required: true }, // delta time
  type: { type: String, enum: ['char', 'backspace', 'paste'], required: true }
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  keystrokes: [KeystrokeSchema],
  stats: {
    pasteCount: { type: Number, default: 0 },
    backspaceCount: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
