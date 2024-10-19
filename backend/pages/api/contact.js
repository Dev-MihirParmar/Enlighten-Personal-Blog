import dbConnect from '../../lib/dbConnect';
import ContactMessage from '../../models/ContactMessage';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { name, email, message } = req.body;

      // Validate inputs
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      // Save the message to the database
      await ContactMessage.create({ name, email, message });

      res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
