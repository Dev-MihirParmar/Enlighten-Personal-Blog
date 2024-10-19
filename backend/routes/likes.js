const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Like = require('../models/Like');

// @route   POST api/likes/:contentId
// @desc    Like content
// @access  Private
router.post('/:contentId', auth, async (req, res) => {
  try {
    const like = await Like.findOne({ user: req.user.id, contentId: req.params.contentId });

    if (like) {
      // Unlike
      await Like.findOneAndDelete({ user: req.user.id, contentId: req.params.contentId });
      res.json({ msg: 'Content unliked' });
    } else {
      // Like
      const newLike = new Like({
        user: req.user.id,
        contentId: req.params.contentId,
      });
      await newLike.save();
      res.json({ msg: 'Content liked' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
