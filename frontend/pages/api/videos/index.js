import { connectToDatabase } from '@/lib/mongodb';
import Video from '@/models/Video';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const videos = await Video.find({});
        return res.status(200).json(videos);
    } else if (req.method === 'POST') {
        const newVideo = new Video(req.body);
        await newVideo.save();
        return res.status(201).json(newVideo);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
