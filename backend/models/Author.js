import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  bio: String,
});

export default mongoose.models.Author || mongoose.model('Author', AuthorSchema);
