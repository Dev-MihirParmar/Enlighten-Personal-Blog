import dbConnect from '../../../../lib/dbConnect';
import Content from '../../../../models/Content';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const { action } = req.body; // 'like' or 'unlike'

  await dbConnect();

  if (method === 'POST') {
    try {
      let update;
      if (action === 'like') {
        update = { $inc: { likes: 1 } };
      } else if (action === 'unlike') {
        update = { $inc: { likes: -1 } };
      } else {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      const content = await Content.findByIdAndUpdate(id, update, { new: true });
      if (!content) {
        return res.status(404).json({ success: false, message: 'Content not found' });
      }
      res.status(200).json({ success: true, data: { likes: content.likes } });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
