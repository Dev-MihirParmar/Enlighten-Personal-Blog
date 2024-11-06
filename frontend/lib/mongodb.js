import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;
    }
}
