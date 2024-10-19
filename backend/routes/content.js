const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/content
// @desc    Get all content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find()
      .populate('author', ['name', 'avatar'])
      .sort({ date: -1 });
    res.json(contents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/content
// @desc    Create content (article or video)
// @access  Private
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').notEmpty(),
    check('type', 'Type is required').notEmpty(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { title, subheading, content, videoUrl, image, category, type } = req.body;

    try {
      const newContent = new Content({
        title,
        subheading,
        content,
        videoUrl,
        image,
        category,
        type,
        author: req.user.id,
      });

      const savedContent = await newContent.save();
      res.json(savedContent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/content/:id
// @desc    Get content by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', ['name', 'avatar']);

    if (!content) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    // Increment views
    content.views += 1;
    await content.save();

    res.json(content);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Content not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
