const mongoose = require('mongoose');
const Content = require('../models/Content');
const Author = require('../models/Author');

const MONGODB_URI = 'mongodb://localhost:27017/my_personal_website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    await mongoose.connection.dropDatabase();

    const author = new Author({
      name: 'Mihir Parmar',
      avatar: '/images/author.svg',
      bio: 'A passionate developer...',
    });

    await author.save();

    const contents = [
      {
        title: 'The Future of Web Development: Exploring Next.js and React Server Components',
        subheading: 'Dive into the cutting-edge features of Next.js...',
        content: '<p>Next.js has been at the forefront...</p>',
        date: new Date('2023-10-18'),
        readTime: '10 min read',
        image: '/images/placeholder.svg',
        category: 'Web Development',
        type: 'Article',
        views: 1500,
        likes: 120,
        bookmarks: 45,
        commentsCount: 23,
        author: author._id,
      },
      {
        title: 'Building a React Native App',
        subheading: 'Step-by-step guide to creating a mobile app...',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        date: new Date('2023-08-15'),
        duration: '45 min',
        image: '/images/placeholder.svg',
        category: 'Mobile Development',
        type: 'Video',
        views: 3000,
        likes: 200,
        bookmarks: 80,
        commentsCount: 40,
        author: author._id,
      },
      // Add more content as needed
    ];

    await Content.insertMany(contents);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
