'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Meditor from "@/components/Meditor"
import { Calendar, Clock, Search, Sun, Moon, Upload, Save, Trash, Mail, Rss, Download, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function EditVideoPage({ videoId }: { videoId: string }) {
  const [darkMode, setDarkMode] = useState(true)
  const [videoData, setVideoData] = useState({
    id: "",
    title: "",
    subheading: "",
    description: "",
    author: {
      name: "Mihir Parmar",
      avatar: "/author.svg?height=400&width=400"
    },
    date: "",
    duration: "",
    likes: 0,
    bookmarks: 0,
    videoUrl: "",
    relatedContent: []
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (videoId) {
      fetchVideo(videoId)
    }
  }, [videoId])

  const fetchVideo = async (id: string) => {
    setIsLoading(true)
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/videos/${id}`)
      const data = await response.json()
      setVideoData(data)
    } catch (error) {
      toast.error('Failed to fetch video')
    }
    setIsLoading(false)
  }

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      })

      if (response.ok) {
        toast.success('Changes saved successfully!')
      } else {
        throw new Error('Failed to save video')
      }
    } catch (error) {
      toast.error('Failed to save video')
    }
    setIsLoading(false)
  }

  const handleDeleteVideo = async () => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/videos/${videoId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success("Video deleted")
          // Redirect to videos list or home page
        } else {
          throw new Error('Failed to delete video')
        }
      } catch (error) {
        toast.error('Failed to delete video')
      }
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoData(prev => ({ ...prev, videoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
      toast.info('Video uploaded successfully!')
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={`${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
          <div className="w-full px-8">
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                <Link href="/" className="flex-none text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Enlighten</Link>
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
                  <Button variant="default" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                    {isPreviewMode ? 'Back to Edit' : 'Preview'}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {isPreviewMode ? (
              // Preview Mode
              <div>
                <header className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">{videoData.title}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{videoData.subheading}</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={videoData.author.avatar} alt={videoData.author.name} />
                        <AvatarFallback>{videoData.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{videoData.author.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{videoData.date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{videoData.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Video Player */}
                <main className="mb-12">
                  <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                    {videoData.videoUrl ? (
                      <video
                        className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                        src={videoData.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">No video uploaded</p>
                      </div>
                    )}
                  </div>
                </main>

                {/* Video Description */}
                <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Description</h3>
                  <div className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: videoData.description }} />
                </section>
              </div>
            ) : (
              // Edit Mode
              <div>
                {/* Content Editor Header */}
                <header className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">Edit Video</h1>
                </header>

                {/* Video Details Editor */}
                <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Video Details</h3>
                  <div className="space-y-4">
                    <Input
                      value={videoData.title}
                      onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Video Title"
                      className="w-full p-2 border rounded-md"
                    />
                    <Input
                      value={videoData.subheading}
                      onChange={(e) => setVideoData(prev => ({ ...prev, subheading: e.target.value }))}
                      placeholder="Video Subheading"
                      className="w-full p-2 border rounded-md"
                    />
                    <Input
                      value={videoData.date}
                      onChange={(e) => setVideoData(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="Date (e.g., May 15, 2023)"
                      className="w-full p-2 border rounded-md"
                    />
                    <Input
                      value={videoData.duration}
                      onChange={(e) => setVideoData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Duration (e.g., 15:30)"
                      className="w-full p-2 border rounded-md"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Description</label>
                      <Card className="min-h-[200px] p-4 bg-white dark:bg-gray-700">
                        <Meditor content={videoData.description} setContent={(content) => setVideoData(prev => ({ ...prev, description: content }))} />
                      </Card>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Replace Video</label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="w-full p-2 border rounded-md"
                      />
                      {videoData.videoUrl && (
                        <div className="mt-4">
                          <video controls src={videoData.videoUrl} className="w-full rounded-md" />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <section className="mb-8 flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Button variant="default" size="sm" onClick={handleSaveChanges} disabled={isLoading}>
                    {isLoading ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteVideo}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Video
                  </Button>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className={`${darkMode ? 'bg-gray-900 text-gray-400 border-gray-800' : 'bg-gray-900 text-gray-400 border-gray-800'} border-t`}>
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={videoData.author.avatar}
                  alt={videoData.author.name}
                  width={200}
                  height={200}
                  className="rounded-full shadow-lg"
                />
              </div>
              {/* Author Info */}
              <div className="flex-grow text-center md:text-left">
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{videoData.author.name}</h2>
                <p className="text-lg mb-6 max-w-2xl">A passionate developer, coder, and tech enthusiast sharing knowledge and insights about web development and beyond.</p>
                {/* Social Media Links */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {[
                    { icon: Facebook, label: 'Facebook', href: 'https://mihirparmar.vercel.app/' },
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
                {/* Resume Download Button */}
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              </div>
            </div>

            {/* Copyright */}
            <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              &copy; {new Date().getFullYear()} {videoData.author.name}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}