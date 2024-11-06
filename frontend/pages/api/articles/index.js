import { connectToDatabase } from '@/lib/mongodb';
import Article from '@/models/Article';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'GET') {
        const articles = await Article.find({});
        return res.status(200).json(articles);
    } else if (req.method === 'POST') {
        const newArticle = new Article(req.body);
        await newArticle.save();
        return res.status(201).json(newArticle);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
