
const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const aiService = require('../services/aiService');

router.post('/', async (req,res)=>{
  try{
    const { userId, questionId, responseText } = req.body;
    const question = await Question.findById(questionId);
    // call AI evaluation (this is a stub that calls aiService)
    const aiEval = await aiService.evaluateAnswer({ question, responseText, userId });
    const attempt = await Attempt.create({ userId, questionId, responseText, aiEvaluation: aiEval });
    res.json({ attempt });
  }catch(err){ console.error(err); res.status(500).json({ error: 'Server error' })}
});

router.get('/user/:userId', async (req,res)=>{
  const attempts = await Attempt.find({ userId: req.params.userId }).limit(100);
  res.json({ attempts });
});

module.exports = router;
