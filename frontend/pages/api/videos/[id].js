import { connectToDatabase } from '@/lib/mongodb';
import Video from '@/models/Video';

export default async function handler(req, res) {
    await connectToDatabase();

    const { id } = req.query;

    if (req.method === 'GET') {
        const video = await Video.findById(id);
        return res.status(200).json(video);
    } else if (req.method === 'PUT') {
        const updatedVideo = await Video.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedVideo);
    } else if (req.method === 'DELETE') {
        await Video.findByIdAndDelete(id);
        return res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
