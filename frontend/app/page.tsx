// ./app/page.tsx

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

// Define the Author interface
interface Author {
  name: string;
  avatar: string;
  bio: string;
}

// Define the Content interface
interface Content {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  type: 'article' | 'video' | 'project' | 'repository';
  views: number;
  likes: number;
  bookmarks: number;
  author: Author;
}

// Define the author constant
const author: Author = {
  name: 'John Doe',
  avatar: '/placeholder.svg?height=200&width=200',
  bio: 'Passionate web developer and designer with over 10 years of experience. Specializing in creating modern, responsive, and user-friendly websites.',
};

// Define the contents array outside the component for referential stability
const contents: Content[] = [
  // ... your content items ...
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt:
      'Exploring upcoming trends and technologies that will shape the web development landscape in the coming years, including AI-driven development, WebAssembly, and more.',
    date: '2023-09-15',
    readTime: '5 min read',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Technology',
    type: 'article',
    views: 1200,
    likes: 45,
    bookmarks: 23,
    author: author,
  },
  {
    id: '2',
    title: 'Building a React Native App',
    excerpt:
      'Step-by-step guide to creating a cross-platform mobile app using React Native and modern best practices, including state management and performance optimization techniques.',
    date: '2023-09-10',
    readTime: '15 min watch',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Mobile Development',
    type: 'video',
    views: 3500,
    likes: 120,
    bookmarks: 67,
    author: author,
  },
  {
    id: '3',
    title: 'Machine Learning Chatbot',
    excerpt:
      'An open-source project for building intelligent chatbots using cutting-edge machine learning techniques, natural language processing, and adaptive learning algorithms.',
    date: '2023-09-05',
    readTime: 'Ongoing project',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Artificial Intelligence',
    type: 'project',
    views: 800,
    likes: 30,
    bookmarks: 15,
    author: author,
  },
  {
    id: '4',
    title: 'Awesome JavaScript',
    excerpt:
      'A curated list of amazing JavaScript libraries, tools, and resources for modern web development, including frameworks, testing utilities, and productivity boosters.',
    date: '2023-09-01',
    readTime: '1000+ stars',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Open Source',
    type: 'repository',
    views: 5000,
    likes: 250,
    bookmarks: 180,
    author: author,
  },
  {
    id: '5',
    title: 'Mastering CSS Grid Layout',
    excerpt:
      'Deep dive into advanced CSS Grid techniques for creating complex and responsive web layouts with ease, including nested grids and alignment strategies.',
    date: '2023-09-20',
    readTime: '8 min read',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Web Design',
    type: 'article',
    views: 2300,
    likes: 89,
    bookmarks: 42,
    author: author,
  },
  {
    id: '6',
    title: 'Introduction to GraphQL',
    excerpt:
      'Learn the basics of GraphQL and how it can improve your API design and data fetching efficiency, with practical examples and best practices.',
    date: '2023-09-18',
    readTime: '12 min watch',
    image: '/placeholder.svg?height=400&width=600',
    category: 'API Development',
    type: 'video',
    views: 1800,
    likes: 76,
    bookmarks: 38,
    author: author,
  },
];

export default function Component() {
  // State variables
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'video' | 'project' | 'repository'>('all');
  const [featuredPostIndex, setFeaturedPostIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Ref for the newsletter section
  const newsletterRef = useRef<HTMLOptionElement | null>(null);

  // Framer Motion hooks for header opacity
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Add 'dark' class to the document on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Memoize filteredContents to optimize performance
  const filteredContents = useMemo(() => {
    return activeTab === 'all' ? contents : contents.filter((content) => content.type === activeTab);
  }, [activeTab]);

  // useEffect to update the featured post index periodically
  useEffect(() => {
    if (filteredContents.length === 0) return; // Prevent division by zero

    const interval = setInterval(() => {
      setFeaturedPostIndex((prevIndex) => (prevIndex + 1) % filteredContents.length);
    }, 10000); // Change featured post every 10 seconds

    return () => clearInterval(interval);
  }, [activeTab, filteredContents.length]);

  // useEffect to handle scroll events with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check if the user has scrolled to the newsletter section
      if (newsletterRef.current) {
        const rect = newsletterRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setShowNewsletter(true);
        }
      }
    }, 200); // Throttle to run at most once every 200ms

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled calls
    };
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
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
    if (['all', 'article', 'video', 'project', 'repository'].includes(value)) {
      setActiveTab(value as "all" | "article" | "video" | "project" | "repository");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-10 transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        style={{ opacity: headerOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-4">
          {/* Top Navigation */}
          <div className={`flex justify-between items-center mb-4 transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
            <div className="w-1/3"></div>
            <Link href="/" className={`text-3xl font-bold text-center w-1/3 relative ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {/* Animated Logo Letters */}
              {['J', 'o', 'h', 'n', ' ', 'D', 'o', 'e'].map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 + index * 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
            </Link>
            {/* Dark Mode Toggle */}
            <div className="w-1/3 flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
                      {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle {darkMode ? 'light' : 'dark'} mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col items-center space-y-4">
            {/* Search Bar */}
            <motion.div
              className={`relative w-full max-w-3xl transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} bg-opacity-50 backdrop-blur-md rounded-full p-2 ${scrolled ? 'shadow-lg' : ''}`}>
                <Input
                  type="text"
                  placeholder="Search content..."
                  className={`pl-10 pr-4 py-2 w-full rounded-full bg-transparent ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} bg-opacity-50 backdrop-blur-md rounded-full p-2 ${scrolled ? 'hidden' : ''}`}
            >
              <Tabs defaultValue="all" className="w-full max-w-2xl" onValueChange={handleTabChange}>
                <TabsList className="w-full justify-center bg-transparent">
                  {[
                    { value: 'all', icon: Zap },
                    { value: 'article', icon: Book },
                    { value: 'video', icon: Video },
                    { value: 'project', icon: Code },
                    { value: 'repository', icon: Archive },
                  ].map(({ value, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className={`text-sm px-4 py-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Post Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Featured Post</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevFeatured} className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextFeatured} className="rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {filteredContents.length > 0 && (
              <FeaturedCard key={filteredContents[featuredPostIndex].id} content={filteredContents[featuredPostIndex]} darkMode={darkMode} />
            )}
          </AnimatePresence>
        </section>

        {/* Latest Content Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Latest Content</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {filteredContents.map((content, index) => (
              <ContentCard key={content.id} content={content} index={index} darkMode={darkMode} />
            ))}
          </motion.div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full">
              Load More Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section ref={newsletterRef} className={`${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-lg p-8 mb-12`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={showNewsletter ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Subscribe to My Newsletter</h2>
            <p className="mb-6 text-white">Get the latest articles, videos, and news delivered straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className={`flex-grow ${darkMode ? 'bg-blue-700 text-white placeholder-blue-300' : 'bg-white text-blue-900 placeholder-blue-400'} rounded-full`}
              />
              <Button
                type="submit"
                className={`rounded-full ${darkMode ? 'bg-white text-blue-600 hover:bg-blue-100' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML5', 'CSS3', 'GraphQL', 'Python'].map((skill, index) => (
              <motion.div
                key={skill}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow-md`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get in Touch</h2>
          <Card className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
            <CardHeader>
              <CardTitle>Contact Me</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Feel free to reach out for collaborations or just a friendly chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input
                  placeholder="Your Name"
                  className={`${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className={`${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <Input
                  placeholder="Subject"
                  className={`${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                />
                <textarea
                  className={`w-full h-32 px-3 py-2 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} border ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="Your Message"
                ></textarea>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`${
          darkMode
            ? 'bg-gray-900 text-gray-400 border-gray-800'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        } border-t`}
      >
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
            </div>
            {/* Author Info */}
            <div className="flex-grow text-center md:text-left">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {author.name}
              </h2>
              <p className="text-lg mb-6 max-w-2xl">{author.bio}</p>
              {/* Social Media Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {[
                  { icon: Facebook, label: 'Facebook', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' },
                  { icon: Github, label: 'GitHub', href: '#' },
                ].map((platform, index) => (
                  <a
                    key={index}
                    href={platform.href}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                      darkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                    } transition-colors duration-200`}
                    aria-label={`Follow on ${platform.label}`}
                  >
                    <platform.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation and Actions */}
          <div
            className={`mt-12 pt-8 border-t ${
              darkMode ? 'border-gray-800' : 'border-gray-300'
            } flex flex-col sm:flex-row justify-between items-center`}
          >
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-0">
              {['Home', 'About', 'Projects', 'Blog', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`${
                    darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors duration-200`}
                >
                  {item}
                </a>
              ))}
            </nav>
            {/* Contact and Resume Actions */}
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className={`${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={`${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Rss className="h-5 w-5" />
              </a>
              {/* Resume Download Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Download className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                  <DialogHeader>
                    <DialogTitle>Download Resume</DialogTitle>
                    <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Choose the format you prefer for downloading the resume.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">PDF</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Word</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} {author.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// FeaturedCard Component
function FeaturedCard({ content, darkMode }: { content: Content; darkMode: boolean }) {
  return (
    <motion.div
      key={content.id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <Link href={`/content/${content.id}`}>
        <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg`}>
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:flex-shrink-0 relative">
              <Image
                src={content.image}
                alt={content.title}
                width={600}
                height={400}
                className="h-48 w-full object-cover md:h-full md:w-48"
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
                <h3 className={`mt-1 text-xl leading-tight font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {content.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{content.excerpt}</p>
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
      <Link href={`/content/${content.id}`}>
        <Card
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg transform hover:scale-105`}
        >
          <CardHeader className="p-4">
            <div className="relative">
              <Image
                src={content.image}
                alt={content.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {content.type}
              </div>
            </div>
            <CardTitle className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {content.title}
            </CardTitle>
            <CardDescription className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {content.excerpt}
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
