import dbConnect from '../../../../../lib/dbConnect';
import Comment from '../../../../../models/Comment';
import Content from '../../../../../models/Content';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // contentId

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const comments = await Comment.find({ contentId: id }).sort({ date: -1 });
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, email, comment } = req.body;

        // Validate inputs
        if (!comment) {
          return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
        }

        const newComment = await Comment.create({
          contentId: id,
          name: name || 'Anonymous',
          email,
          comment,
        });

        // Increment the comments count in Content model
        await Content.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

        res.status(201).json({ success: true, data: newComment });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
