'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Eye, Heart, Bookmark, Share2, Search, Edit, Sun, Moon, ArrowLeft, ArrowRight, Facebook, Twitter, Instagram, Linkedin, Github, Mail, Rss, Download, MessageSquare, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Meditor from "@/components/Meditor"

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
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState("")
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
                  <Card className="min-h-[400px] w-full p-4">
                    <Meditor content={article.content} setContent={handleContentChange} />
                  </Card>
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
                    aria-labelledby="article-title"
                  >
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </article>
                </main>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
