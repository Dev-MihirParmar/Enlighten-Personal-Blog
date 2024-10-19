#!/bin/bash

# Script to set up the backend project in the current directory

# Ensure we're in the project directory
echo "Setting up the backend project in the current directory: $(pwd)"

# Initialize npm project
echo "Initializing npm project..."
npm init -y

echo "Installing dependencies..."
npm install express mongoose bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon

echo "Updating package.json scripts..."
npx npm-add-script -k "start" -v "node index.js"
npx npm-add-script -k "dev" -v "nodemon index.js"

echo "Creating directory structure..."
mkdir -p config controllers middleware models routes

echo "Creating .env file..."
cat <<EOT >> .env
MONGO_URI=mongodb://localhost:27017/my-app
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
EOT

# The rest of the script remains the same, creating files in the current directory

echo "Creating config/db.js..."
cat <<EOT >> config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
EOT

echo "Creating middleware/auth.js..."
cat <<EOT >> middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
EOT

echo "Creating routes/users.js..."
mkdir -p routes
cat <<EOT >> routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Password min length is 6').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create user
      user = new User({ name, email, password });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      // Return JWT
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
EOT

echo "Creating routes/auth.js..."
cat <<EOT >> routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { email, password } = req.body;

    try {
      // Check for user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return JWT
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
EOT

echo "Creating routes/content.js..."
cat <<EOT >> routes/content.js
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
EOT

echo "Creating routes/comments.js..."
cat <<EOT >> routes/comments.js
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
EOT

echo "Creating routes/likes.js..."
cat <<EOT >> routes/likes.js
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
EOT

echo "Creating routes/bookmarks.js..."
cat <<EOT >> routes/bookmarks.js
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
EOT

echo "Creating index.js..."
cat <<EOT >> index.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/bookmarks', require('./routes/bookmarks'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server started on port \${PORT}\`));
EOT

echo "Setup complete! Your backend project is ready."
