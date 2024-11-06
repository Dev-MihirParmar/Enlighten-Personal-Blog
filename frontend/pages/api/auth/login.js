import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            // Implement session handling or token generation here
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
