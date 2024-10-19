const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const { check, validationResult } = require('express-validator');

// @route   POST api/comments/:contentId
// @desc    Add a comment
// @access  Private
router.post(
  '/:contentId',
  auth,
  [check('text', 'Text is required').notEmpty()],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newComment = new Comment({
        text: req.body.text,
        contentId: req.params.contentId,
        user: req.user.id,
      });

      const comment = await newComment.save();
      res.json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/comments/:contentId
// @desc    Get comments for content
// @access  Public
router.get('/:contentId', async (req, res) => {
  try {
    const comments = await Comment.find({ contentId: req.params.contentId })
      .populate('user', ['name', 'avatar'])
      .sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
