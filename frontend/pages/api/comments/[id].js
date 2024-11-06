import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';

export default async function handler(req, res) {
    await connectToDatabase();

    const { id } = req.query;

    if (req.method === 'GET') {
        const comment = await Comment.findById(id);
        return res.status(200).json(comment);
    } else if (req.method === 'PUT') {
        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedComment);
    } else if (req.method === 'DELETE') {
        await Comment.findByIdAndDelete(id);
        return res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
