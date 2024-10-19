const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');

// @route   POST api/bookmarks/:contentId
// @desc    Bookmark content
// @access  Private
router.post('/:contentId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ user: req.user.id, contentId: req.params.contentId });

    if (bookmark) {
      // Remove bookmark
      await Bookmark.findOneAndDelete({ user: req.user.id, contentId: req.params.contentId });
      res.json({ msg: 'Bookmark removed' });
    } else {
      // Add bookmark
      const newBookmark = new Bookmark({
        user: req.user.id,
        contentId: req.params.contentId,
      });
      await newBookmark.save();
      res.json({ msg: 'Content bookmarked' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
