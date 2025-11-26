const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_chatbot_demo';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Message schema to store chat history
const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user','bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Simple health route
app.get('/', (req, res) => res.send('AI Chatbot Backend with MongoDB running'));

// Get chat history
app.get('/api/history', async (req, res) => {
  try {
    const history = await Message.find().sort({ timestamp: 1 }).limit(1000).lean();
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Chat endpoint - saves messages and returns AI reply
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if(!message) return res.status(400).json({ error: 'No message provided' });

    // Save user message
    const userMsg = new Message({ sender: 'user', text: message });
    await userMsg.save();

    // Placeholder AI response generator - replace with real AI call
    const aiReplyText = generateAIResponse(message);

    // Save bot message
    const botMsg = new Message({ sender: 'bot', text: aiReplyText });
    await botMsg.save();

    return res.json({ reply: aiReplyText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function generateAIResponse(message) {
  // TODO: replace with real AI provider call (OpenAI, etc.)
  if(!message) return "Please send a message.";
  const replies = [
    "I got that. Can you tell me more?",
    "Interesting! Here's a short summary: " + message.slice(0,120),
    "Thanks for sharing. I can help with that."
  ];
  return message.length % 3 === 0 ? replies[1] : replies[0];
}

app.listen(port, () => console.log(`Server listening on port ${port}`));
