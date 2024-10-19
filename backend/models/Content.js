import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  title: String,
  subheading: String,
  content: String, // For articles
  videoUrl: String, // For videos
  date: Date,
  readTime: String, // For articles
  duration: String, // For videos
  image: String,
  category: String,
  type: { type: String, enum: ['Article', 'Video', 'Project', 'Repository'] },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
