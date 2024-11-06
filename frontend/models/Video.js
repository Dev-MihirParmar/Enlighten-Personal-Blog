import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subheading: { type: String },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: String },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    author: { type: String },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
