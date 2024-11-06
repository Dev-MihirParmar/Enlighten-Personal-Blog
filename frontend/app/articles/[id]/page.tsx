"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Eye, Heart, Bookmark, Share2, Search, Edit, Sun, Moon, Star, ArrowLeft, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Github, Mail, Rss, Download, MessageSquare } from 'lucide-react';

export default function UpdatedContentPage() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Retrieve dark mode preference from localStorage if available
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('darkMode');
      return storedMode ? JSON.parse(storedMode) : true;
    }
    return true;
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const relatedContentRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? 0 : prevSlide - 1));
    } else {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div>
        {/* Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
          <div className="w-full px-8">
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                {/* Logo - Moved to the left */}
                <Link href="/" passHref legacyBehavior>
                  <a className="flex-none text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Enlighten</a>
                </Link>
                {/* Search */}
                <div className="flex-grow mx-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 border-none"
                      style={{ borderRadius: '50px' }}
                    />
                  </div>
                </div>
                {/* Right side buttons */}
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Comment Box */}
            <section className="mb-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="w-full p-2 border rounded-md"
                />
                <Button type="submit">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </form>

              {/* Display Comments */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Comments</h3>
                {comments.length > 0 ? (
                  <ul className="space-y-4">
                    {comments.map((comment, index) => (
                      <li key={index} className="p-4 bg-white dark:bg-gray-700 rounded-md">
                        <p className="text-gray-900 dark:text-gray-100">{comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </section>

            {/* Get in Touch */}
            <section className="mb-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Feel free to reach out for collaborations or just a friendly chat.</p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" className="bg-white dark:bg-gray-700" />
                  <Input type="email" placeholder="Your Email" className="bg-white dark:bg-gray-700" />
                </div>
                <Textarea placeholder="Your Message" className="bg-white dark:bg-gray-700" rows={4} />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </section>

            {/* Newsletter Subscription */}
            <section className="mb-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Subscribe to My Newsletter</h2>
              <p className="mb-6 text-white">Get the latest Articles, Videos, and news delivered straight to your inbox.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow bg-white/20 text-white placeholder-white/75 border-white/50 focus:border-white rounded-xl"
                />
                <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-100 rounded-full">
                  Subscribe
                </Button>
              </form>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={
            `${darkMode
              ? 'bg-gray-900 text-gray-400 border-gray-800'
              : 'bg-gray-100 text-gray-600 border-gray-300'
            } border-t`
          }
          aria-labelledby="footer"
        >
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex-shrink-0">
                <Image
                  src="/author.svg?height=400&width=400"
                  alt="Author Avatar"
                  width={200}
                  height={200}
                  className="rounded-full shadow-lg"
                  loading="lazy"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Author Name</h2>
                <p className="text-lg mb-6 max-w-2xl">A Passionate developer, Coder, Circuit Designer, Writer, Hobbyist, Electronics Enthusiast, Jee Aspirant or Whatever you like to call it.</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {[{ icon: Facebook, label: 'Facebook', href: '#' },
                    { icon: Twitter, label: 'Twitter', href: '#' },
                    { icon: Instagram, label: 'Instagram', href: '#' },
                    { icon: Linkedin, label: 'LinkedIn', href: '#' },
                    { icon: Github, label: 'GitHub', href: '#' },
                  ].map((platform, index) => (
                    <a
                      key={index}
                      href={platform.href}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'} transition-colors duration-200`}
                      aria-label={`Follow on ${platform.label}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <platform.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'} flex flex-col sm:flex-row justify-between items-center`}>
              <nav className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-0" aria-label="Footer Navigation">
                {['Home', 'About', 'Projects', 'Blog', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:your.email@example.com"
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  aria-label="Send Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  aria-label="RSS Feed"
                >
                  <Rss className="h-5 w-5" />
                </a>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              </div>
            </div>

            <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              &copy; {new Date().getFullYear()} Author Name. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
