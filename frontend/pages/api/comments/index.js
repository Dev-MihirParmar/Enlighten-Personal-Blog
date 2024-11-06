import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const comments = await Comment.find({});
        return res.status(200).json(comments);
    } else if (req.method === 'POST') {
        const newComment = new Comment(req.body);
        await newComment.save();
        return res.status(201).json(newComment);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
