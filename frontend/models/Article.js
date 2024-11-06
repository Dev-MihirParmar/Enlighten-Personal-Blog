import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subheading: { type: String },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    readTime: { type: String },
    image: { type: String },
    category: { type: String },
    author: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
