
const mongoose = require('mongoose');
const LessonSchema = new mongoose.Schema({
  title: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  content: String, // markdown/html
  tags: [String],
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' }
});
module.exports = mongoose.model('Lesson', LessonSchema);
