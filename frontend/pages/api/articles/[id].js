import { connectToDatabase } from '@/lib/mongodb';
import Article from '@/models/Article';

export default async function handler(req, res) {
    await connectToDatabase();

    const { id } = req.query;

    if (req.method === 'GET') {
        const article = await Article.findById(id);
        return res.status(200).json(article);
    } else if (req.method === 'PUT') {
        const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedArticle);
    } else if (req.method === 'DELETE') {
        await Article.findByIdAndDelete(id);
        return res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
