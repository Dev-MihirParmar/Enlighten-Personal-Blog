import dbConnect from '../../../lib/dbConnect';
import Content from '../../../models/Content';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const content = await Content.findById(id).populate('author');

        if (!content) {
          return res.status(404).json({ success: false, message: 'Content not found' });
        }

        const relatedContent = await Content.find({
          _id: { $ne: id },
          category: content.category,
          type: content.type,
        })
          .populate('author')
          .limit(5);

        res.status(200).json({
          success: true,
          data: content,
          relatedContent: relatedContent,
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const content = await Content.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!content) {
          return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedContent = await Content.deleteOne({ _id: id });
        if (!deletedContent) {
          return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
