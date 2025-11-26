
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

router.get('/:id', async (req,res)=>{
  const lesson = await Lesson.findById(req.params.id);
  res.json({ lesson });
});

router.post('/', async (req,res)=>{
  const lesson = await Lesson.create(req.body);
  res.json({ lesson });
});

module.exports = router;
