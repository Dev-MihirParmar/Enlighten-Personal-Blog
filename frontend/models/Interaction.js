import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['Article', 'Video'], required: true },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
});

export default mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);
