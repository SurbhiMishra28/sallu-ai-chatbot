
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req,res)=>{
  const courses = await Course.find().limit(50);
  res.json({ courses });
});

router.post('/', async (req,res)=>{
  const course = await Course.create(req.body);
  res.json({ course });
});

module.exports = router;
