
const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  prompt: String,
  type: { type: String, enum: ['short-answer','mcq','coding'], default: 'short-answer' },
  answerKey: mongoose.Schema.Types.Mixed,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Question', QuestionSchema);
