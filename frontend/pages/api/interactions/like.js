import { connectToDatabase } from '@/lib/mongodb';
import Interaction from '@/models/Interaction';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { itemId, itemType } = req.body;
        const interaction = await Interaction.findOneAndUpdate(
            { itemId, itemType },
            { $inc: { likes: 1 } },
            { upsert: true, new: true }
        );
        return res.status(200).json(interaction);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
