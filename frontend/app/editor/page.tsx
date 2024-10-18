"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Heart, Bookmark, Share2, Search, Edit, Sun, Moon, Save } from 'lucide-react';
import axios from 'axios';

// Rich Text Editor for editing content
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

export default function UpdatedContentPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    subheading: '',
    content: '',
    date: '',
    image: '',
    author: { name: '', avatar: '' },
    likes: 0,
    bookmarks: 0,
  });
  const [isNewArticle, setIsNewArticle] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, ImageExtension, LinkExtension],
    content: article.content,
    onUpdate: ({ editor }) => {
      setArticle({ ...article, content: editor.getHTML() });
    },
  });

  useEffect(() => {
    // Fetch the article from the backend if editing an existing one
    const fetchArticle = async () => {
      const articleId = new URLSearchParams(window.location.search).get('id');
      if (articleId) {
        setIsNewArticle(false);
        try {
          const response = await axios.get(`/api/articles/${articleId}`);
          setArticle(response.data);
        } catch (error) {
          console.error('Error fetching the article:', error);
        }
      }
    };

    fetchArticle();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const saveArticle = async () => {
    try {
      if (isNewArticle) {
        await axios.post('/api/articles', article);
      } else {
        await axios.put(`/api/articles/${article.id}`, article);
      }
      alert('Article saved successfully!');
    } catch (error) {
      console.error('Error saving the article:', error);
      alert('Failed to save the article.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-900 text-gray-400 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
          <div className="w-full px-8">
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                {/* Logo - Moved to the left */}
                <Link href="/" passHref className="flex-none text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Enlighten</Link>
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
                  <Button variant="outline" size="sm" onClick={saveArticle}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Content Header */}
            <header className="mb-8">
              <Input value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} className='w-full text-4xl font-bold mb-2 bg-transparent' placeholder="Article Title" />
              <Input value={article.subheading} onChange={(e) => setArticle({ ...article, subheading: e.target.value })} className='w-full text-xl bg-transparent' placeholder="Article Subheading" />
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{article.author.name || 'Author Name'}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <Input value={article.date} onChange={(e) => setArticle({ ...article, date: e.target.value })} className='w-full bg-transparent' placeholder="Publication Date" />
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.readTime || 'Read Time'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {article.likes}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                    <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    {article.bookmarks}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>
              <div className="mb-8">
                <Input
                  value={article.image}
                  onChange={(e) => setArticle({ ...article, image: e.target.value })}
                  placeholder="Enter image URL..."
                  className="w-full mb-2 bg-transparent"
                />
                {article.image && <img src={article.image} alt={article.title} className="rounded-lg mb-8 w-full object-cover" />}
              </div>
              <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <EditorContent editor={editor} />
              </article>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
