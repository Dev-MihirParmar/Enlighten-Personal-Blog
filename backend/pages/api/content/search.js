import dbConnect from '../../../lib/dbConnect';
import Content from '../../../models/Content';

export default async function handler(req, res) {
  const { method, query } = req;
  const { q } = query;

  await dbConnect();

  if (method === 'GET') {
    try {
      const contents = await Content.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { subheading: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ],
      })
        .populate('author')
        .sort({ date: -1 });

      res.status(200).json({ success: true, data: contents });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
