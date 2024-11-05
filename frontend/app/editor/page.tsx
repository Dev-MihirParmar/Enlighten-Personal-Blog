'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Eye, Heart, Bookmark, Share2, Search, Edit, Sun, Moon, Star, ArrowLeft, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Github, Mail, Rss, Download, MessageSquare, Upload } from 'lucide-react'
import Meditor from "@/components/Meditor"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ImprovedArticleEditor({ existingArticle = null }) {
  const [article, setArticle] = useState(existingArticle || {
    id: '',
    title: '',
    subheading: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '',
    image: '/placeholder.svg?height=400&width=800',
    category: '',
    type: 'Article',
    views: 0,
    likes: 0,
    bookmarks: 0,
    comments: 0,
    author: {
      name: 'Mihir Parmar',
      avatar: '/author.svg?height=400&width=400',
    },
    relatedContent: []
  })
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('darkMode')
      return storedMode ? JSON.parse(storedMode) : true
    }
    return true
  })
  const [activeTab, setActiveTab] = useState('edit')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState("")
  const relatedContentRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticle(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (value: string) => {
    setArticle(prev => ({ ...prev, content: value }))
  }

  const handleSave = () => {
    console.log("Saving article:", article)
    // Here you would typically send this data to your backend or API
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setArticle(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? article.relatedContent.length - 1 : prevSlide - 1))
    } else {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % article.relatedContent.length)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      setComments([...comments, newComment])
      setNewComment("")
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
        <div className="w-full px-8">
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              <Link href="/" className="flex-none text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Enlighten
              </Link>
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
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={article.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title"
                    className="w-full mt-1"
                    aria-label="Article title"
                  />
                </div>
                <div>
                  <Label htmlFor="subheading">Subheading</Label>
                  <Input
                    id="subheading"
                    name="subheading"
                    value={article.subheading}
                    onChange={handleInputChange}
                    placeholder="Enter article subheading"
                    className="w-full mt-1"
                    aria-label="Article subheading"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Meditor
                    content={article.content}
                    setContent={handleContentChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={article.date}
                      onChange={handleInputChange}
                      className="w-full mt-1"
                      aria-label="Article date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={article.readTime}
                      onChange={handleInputChange}
                      placeholder="e.g. 5 min read"
                      className="w-full mt-1"
                      aria-label="Article read time"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image">Main Image</Label>
                  <div className="flex items-center space-x-4 mt-1">
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Input
                      id="image"
                      name="image"
                      value={article.image}
                      onChange={handleInputChange}
                      placeholder="Or enter image URL"
                      className="flex-grow"
                      aria-label="Article image URL"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={article.category}
                    onChange={handleInputChange}
                    placeholder="Enter article category"
                    className="w-full mt-1"
                    aria-label="Article category"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="space-y-8">
                {/* Content Header */}
                <header>
                  <h1 className="text-4xl font-bold mb-2" id="article-title">{article.title}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4" id="article-subheading">{article.subheading}</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={article.author.avatar} alt={article.author.name} />
                        <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{article.author.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{article.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.readTime}</span>
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
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="rounded-lg mb-8 w-full object-cover"
                  />
                  <article 
                    className="prose prose-lg dark:prose-invert max-w-none mb-12" 
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    aria-labelledby="article-title"
                  />
                </main>

                {/* Action Bar */}
                <section className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {article.likes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                      <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      {article.bookmarks}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </section>

                {/* Comment Box */}
                <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment here..."
                      className="w-full p-2 border rounded-md"
                      aria-label="Comment textarea"
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

                {/* Related Content - Auto-sliding */}
                {article.relatedContent && article.relatedContent.length > 0 && (
                  <section className="overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Related Content</h2>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleArrowClick('left')}>
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleArrowClick('right')}>
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        ref={relatedContentRef}
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {article.relatedContent.map((item, index) => (
                          <Card key={index} className={`flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4 shadow-md border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg mr-6`}>
                            <div className="relative">
                              <Image
                                src={item.image || '/placeholder.svg'}
                                alt={item.title || 'Related content'}
                                width={600}
                                height={400}
                                className="w-full h-40 object-cover rounded-t-lg"
                              />
                              <span className={`absolute top-2 left-2 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white px-2 py-1 text-xs font-semibold rounded`}>
                                {item.type || 'Article'}
                              </span>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg mb-2">{item.title || 'Untitled'}</h3>
                              <p className="text-sm mb-4">{item.description || 'No description available'}</p>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="mr-4">{item.date || 'No date'}</span>
                                {item.stars !== undefined && (
                                  <>
                                    <Star className="h-4 w-4 mr-1" />
                                    <span className="mr-4">{item.stars}</span>
                                  </>
                                )}
                                <Eye className="h-4 w-4 mr-1" />
                                <span>{item.views || 0}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center mt-4 space-x-2">
                      {article.relatedContent.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={
          `${darkMode
            ? 'bg-gray-900 text-gray-400 border-gray-800'
            : 'bg-gray-100 text-gray-600 border-gray-300'
          } border-t mt-12`
        }
        aria-labelledby="footer"
      >
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
            {/* Author Avatar - Made circular */}
            <div className="flex-shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={200}
                height={200}
                className="rounded-full shadow-lg"
                loading="lazy"
              />
            </div>
            {/* Author Info */}
            <div className="flex-grow text-center md:text-left">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{article.author.name}</h2>
              <p className="text-lg mb-6 max-w-2xl">A Passionate developer, Coder, Circuit Designer, Writer, Hobbyist, Electronics Enthusiast, Jee Aspirant or Whatever you like to call its.</p>
              {/* Social Media Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {[{ icon: Facebook, label: 'Facebook', href: 'https://mihirparmar.vercel.app/' },
                  { icon: Twitter, label: 'Twitter', href: 'https://x.com/Dev_MihirParmar' },
                  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/dev.mihirparmar/' },
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://mihirparmar.vercel.app/' },
                  { icon: Github, label: 'GitHub', href: 'https://github.com/Dev-MihirParmar' },
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

          {/* Footer Navigation and Actions */}
          <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'} flex flex-col sm:flex-row justify-between items-center`}>
            {/* Navigation Links */}
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
            {/* Contact and Resume Actions */}
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
              {/* Resume Download Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Download className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Resume</DialogTitle>
                    <DialogDescription>
                      Choose the format you'd like to download the resume in.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Button onClick={() => console.log("Downloading PDF")}>
                      Download PDF
                    </Button>
                    <Button onClick={() => console.log("Downloading DOCX")}>
                      Download DOCX
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} {article.author.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}