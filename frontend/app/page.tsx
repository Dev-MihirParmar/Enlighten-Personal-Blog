// pages/index.tsx or app/page.tsx (depending on your Next.js version)
'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  Moon,
  Sun,
  Eye,
  Zap,
  Book,
  Video,
  Code,
  Archive,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Rss,
  Download,
  CheckCircle,
  XCircle,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { throttle } from 'lodash';
import Head from 'next/head';

// Define the Author interface
interface Author {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
}

// Define the Content interface
interface Content {
  _id: string;
  title: string;
  subheading: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  type: 'Article' | 'Video' | 'Project' | 'Repository';
  views: number;
  likes: number;
  bookmarks: number;
  author: Author;
}

export default function HomePage() {
  // State variables
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('darkMode');
      return storedMode ? JSON.parse(storedMode) : true;
    }
    return true;
  });
  const [activeTab, setActiveTab] = useState<'all' | 'Article' | 'Video' | 'Project' | 'Repository'>('all');
  const [featuredPostIndex, setFeaturedPostIndex] = useState<number>(0);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [showNewsletter, setShowNewsletter] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // New state variables for data
  const [contents, setContents] = useState<Content[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for the newsletter section
  const newsletterRef = useRef<HTMLElement | null>(null);

  // Framer Motion hooks for header opacity
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Add or remove 'dark' class based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contents
        const contentsRes = await fetch('http://localhost:3000/api/content');
        const contentsData = await contentsRes.json();
        setContents(contentsData.data);

        // Fetch author information
        const authorRes = await fetch('http://localhost:3000/api/author');
        const authorData = await authorRes.json();
        setAuthor(authorData.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filteredContents to optimize performance
  const filteredContents = useMemo(() => {
    return activeTab === 'all' ? contents : contents.filter((content) => content.type === activeTab);
  }, [activeTab, contents]);

  // useEffect to update the featured post index periodically
  useEffect(() => {
    if (filteredContents.length === 0) return;

    const interval = setInterval(() => {
      setFeaturedPostIndex((prevIndex) => (prevIndex + 1) % filteredContents.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab, filteredContents.length]);

  // Throttled scroll handler to manage scroll-based state
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      setShowBackToTop(scrollY > 300);

      // Check if the user has scrolled to the newsletter section
      if (newsletterRef.current) {
        const rect = newsletterRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setShowNewsletter(true);
        }
      }
    }, 200),
    []
  );

  // useEffect to attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Handlers for navigating featured posts
  const handlePrevFeatured = () => {
    setFeaturedPostIndex((prevIndex) => (prevIndex - 1 + filteredContents.length) % filteredContents.length);
  };

  const handleNextFeatured = () => {
    setFeaturedPostIndex((prevIndex) => (prevIndex + 1) % filteredContents.length);
  };

  // Type-Safe Tab Change Handler
  const handleTabChange = (value: string) => {
    if (['all', 'Article', 'Video', 'Project', 'Repository'].includes(value)) {
      setActiveTab(value as 'all' | 'Article' | 'Video' | 'Project' | 'Repository');
    }
  };

  // Form Submission Handler with Validation
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setNotification({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    if (!emailRegex.test(email)) {
      setNotification({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({ type: 'success', message: 'Thank you for subscribing!' });
        form.reset();
      } else {
        setNotification({ type: 'error', message: data.message || 'Subscription failed.' });
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setNotification({ type: 'error', message: 'An error occurred. Please try again later.' });
    }
  };

  // Function to dismiss notifications
  const dismissNotification = () => {
    setNotification(null);
  };

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{error || 'Failed to load data.'}</p>
      </div>
    );
  }

  return (
    <>
      {/* Head for SEO and Meta Tags */}
      <Head>
        <title>{author.name} - Web Developer & Designer</title>
        <meta name="description" content={`${author.name}'s personal website showcasing Articles, Projects, Videos, and more.`} />
        <meta name="keywords" content={`${author.name}, Web Developer, Designer, JavaScript, React, Next.js, Projects`} />
        <meta property="og:title" content={`${author.name} - Web Developer & Designer`} />
        <meta property="og:description" content={`Explore ${author.name}'s Articles, Projects, and Videos on web development and design.`} />
        <meta property="og:image" content={author.avatar} />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        {/* Notification Banner */}
        {/* ... [Rest of your component code remains the same, using 'contents' and 'author'] */}

        {/* Back to Top Button */}
        {/* ... */}

        {/* Header */}
        {/* ... (Your header code remains the same) */}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Featured Post Section */}
          <section className="mb-12" aria-labelledby="featured-post">
            <div className="flex justify-between items-center mb-6">
              <h2 id="featured-post" className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Featured Post
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevFeatured} className="rounded-full" aria-label="Previous Featured Post">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextFeatured} className="rounded-full" aria-label="Next Featured Post">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {filteredContents.length > 0 && (
                <FeaturedCard key={filteredContents[featuredPostIndex]._id} content={filteredContents[featuredPostIndex]} darkMode={darkMode} />
              )}
            </AnimatePresence>
          </section>

          {/* Latest Content Section */}
          <section className="mb-12" aria-labelledby="latest-content">
            <h2 id="latest-content" className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Latest Content
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {filteredContents.map((content, index) => (
                <ContentCard key={content._id} content={content} index={index} darkMode={darkMode} />
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              {/* Load More Button (Optional) */}
              {/* <Button variant="outline" className="rounded-full">
                Load More Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </div>
          </section>

          {/* Newsletter Section */}
          {/* ... (Your newsletter code remains the same) */}

          {/* Skills Section */}
          {/* ... (Your skills section remains the same) */}

          {/* Contact Section */}
          {/* ... (Your contact section remains the same) */}
        </main>

        {/* Footer */}
        {/* ... (Your footer code remains the same, using 'author' data) */}
      </div>
    </>
  );
}

// FeaturedCard Component
function FeaturedCard({ content, darkMode }: { content: Content; darkMode: boolean }) {
  return (
    <motion.div
      key={content._id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <Link href={`/content/${content._id}`}>
        <Card
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg`}
          role="Article"
          aria-labelledby={`featured-${content._id}`}
        >
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 relative">
              <Image
                src={content.image}
                alt={content.title}
                width={600}
                height={400}
                className="h-48 w-full object-cover md:h-full md:w-48"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {content.type}
              </div>
            </div>
            {/* Content Section */}
            <div className="p-6 md:pl-16 flex flex-col justify-between w-full">
              <div>
                <div className="uppercase tracking-wide text-sm text-blue-400 font-semibold">
                  {content.category}
                </div>
                <h3 id={`featured-${content._id}`} className={`mt-1 text-xl leading-tight font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {content.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{content.subheading}</p>
              </div>
              <div className="mt-4 flex items-center">
                {/* Author Avatar */}
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>{content.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`text-sm font-medium mr-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {content.author.name}
                </span>
                {/* Meta Information */}
                <div className={`flex items-center space-x-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(content.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{content.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    <span>{content.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// ContentCard Component
function ContentCard({ content, index, darkMode }: { content: Content; index: number; darkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 }}
    >
      <Link href={`/content/${content._id}`}>
        <Card
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg transform hover:scale-105`}
          role="Article"
          aria-labelledby={`content-${content._id}`}
        >
          <CardHeader className="p-4">
            <div className="relative">
              <Image
                src={content.image}
                alt={content.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-md mb-4"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {content.type}
              </div>
            </div>
            <CardTitle id={`content-${content._id}`} className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {content.title}
            </CardTitle>
            <CardDescription className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {content.subheading}
            </CardDescription>
            <div className="text-xs text-blue-400 font-semibold uppercase mb-2">{content.category}</div>
            {/* Author and Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>{content.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content.author.name}
                </span>
              </div>
              <div className={`flex items-center space-x-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  <span>{new Date(content.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{content.readTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  <span>{content.views}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
