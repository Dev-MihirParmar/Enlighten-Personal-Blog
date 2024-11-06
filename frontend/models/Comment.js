import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
