import dbConnect from '../../../../lib/dbConnect';
import Content from '../../../../models/Content';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const { action } = req.body; // 'bookmark' or 'unbookmark'

  await dbConnect();

  if (method === 'POST') {
    try {
      let update;
      if (action === 'bookmark') {
        update = { $inc: { bookmarks: 1 } };
      } else if (action === 'unbookmark') {
        update = { $inc: { bookmarks: -1 } };
      } else {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      const content = await Content.findByIdAndUpdate(id, update, { new: true });
      if (!content) {
        return res.status(404).json({ success: false, message: 'Content not found' });
      }
      res.status(200).json({ success: true, data: { bookmarks: content.bookmarks } });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
