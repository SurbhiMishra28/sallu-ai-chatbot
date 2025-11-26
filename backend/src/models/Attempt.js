
const mongoose = require('mongoose');
const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  responseText: String,
  aiEvaluation: mongoose.Schema.Types.Mixed,
  humanOverride: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Attempt', AttemptSchema);
