import dbConnect from '../../../lib/dbConnect';
import Content from '../../../models/Content';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { page = 1, limit = 10, type = 'all' } = query;
        const queryObject = type !== 'all' ? { type } : {};

        const contents = await Content.find(queryObject)
          .populate('author')
          .sort({ date: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit));

        const total = await Content.countDocuments(queryObject);

        res.status(200).json({
          success: true,
          data: contents,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const content = await Content.create(req.body);
        res.status(201).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
