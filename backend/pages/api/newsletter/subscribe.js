import dbConnect from '../../../lib/dbConnect';
import Subscriber from '../../../models/Subscriber';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    try {
      const { email } = req.body;

      // Simple email validation
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
      }

      // Check if the email already exists
      const existingSubscriber = await Subscriber.findOne({ email });
      if (existingSubscriber) {
        return res.status(400).json({ success: false, message: 'Email already subscribed' });
      }

      const subscriber = await Subscriber.create({ email });
      res.status(201).json({ success: true, data: subscriber });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
