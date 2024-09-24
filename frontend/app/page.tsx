'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock, Search, Moon, Sun, Eye, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'

interface Author {
  name: string
  avatar: string
}

interface Content {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  image: string
  category: string
  type: 'article' | 'video' | 'project' | 'repository'
  views: number
  author: Author
}

const authors: Author[] = [
  { name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Bob Johnson', avatar: '/placeholder.svg?height=40&width=40' },
  { name: 'Alice Brown', avatar: '/placeholder.svg?height=40&width=40' },
]

const contents: Content[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies that will shape the web development landscape in the coming years, including AI-driven development, WebAssembly, and more.',
    date: '2023-09-15',
    readTime: '5 min read',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Technology',
    type: 'article',
    views: 1200,
    author: authors[0]
  },
  {
    id: '2',
    title: 'Building a React Native App',
    excerpt: 'Step-by-step guide to creating a cross-platform mobile app using React Native and modern best practices, including state management and performance optimization techniques.',
    date: '2023-09-10',
    readTime: '15 min watch',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Mobile Development',
    type: 'video',
    views: 3500,
    author: authors[1]
  },
  {
    id: '3',
    title: 'Machine Learning Chatbot',
    excerpt: 'An open-source project for building intelligent chatbots using cutting-edge machine learning techniques, natural language processing, and adaptive learning algorithms.',
    date: '2023-09-05',
    readTime: 'Ongoing project',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Artificial Intelligence',
    type: 'project',
    views: 800,
    author: authors[2]
  },
  {
    id: '4',
    title: 'Awesome JavaScript',
    excerpt: 'A curated list of amazing JavaScript libraries, tools, and resources for modern web development, including frameworks, testing utilities, and productivity boosters.',
    date: '2023-09-01',
    readTime: '1000+ stars',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Open Source',
    type: 'repository',
    views: 5000,
    author: authors[3]
  },
  {
    id: '5',
    title: 'Mastering CSS Grid Layout',
    excerpt: 'Deep dive into advanced CSS Grid techniques for creating complex and responsive web layouts with ease, including nested grids and alignment strategies.',
    date: '2023-09-20',
    readTime: '8 min read',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Web Design',
    type: 'article',
    views: 2300,
    author: authors[0]
  },
  {
    id: '6',
    title: 'Introduction to GraphQL',
    excerpt: 'Learn the basics of GraphQL and how it can improve your API design and data fetching efficiency, with practical examples and best practices.',
    date: '2023-09-18',
    readTime: '12 min watch',
    image: '/placeholder.svg?height=400&width=600',
    category: 'API Development',
    type: 'video',
    views: 1800,
    author: authors[1]
  },
  {
    id: '7',
    title: 'Building a Serverless API',
    excerpt: 'Step-by-step guide to creating a scalable and cost-effective serverless API using AWS Lambda and API Gateway, with focus on performance and security.',
    date: '2023-09-12',
    readTime: 'Ongoing project',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Cloud Computing',
    type: 'project',
    views: 950,
    author: authors[2]
  },
  {
    id: '8',
    title: 'Awesome React Hooks',
    excerpt: 'A collection of useful custom React Hooks to supercharge your next React project and improve code reusability, including state management and side-effect handling.',
    date: '2023-09-08',
    readTime: '500+ stars',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Open Source',
    type: 'repository',
    views: 3200,
    author: authors[3]
  },
]

export default function Component() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [featuredPostIndex, setFeaturedPostIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedPostIndex((prevIndex) => (prevIndex + 1) % filteredContents.length)
    }, 10000) // Change featured post every 10 seconds

    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const filteredContents = activeTab === 'all' ? contents : contents.filter(content => content.type === activeTab)

  const handlePrevFeatured = () => {
    setFeaturedPostIndex((prevIndex) => (prevIndex - 1 + filteredContents.length) % filteredContents.length)
  }

  const handleNextFeatured = () => {
    setFeaturedPostIndex((prevIndex) => (prevIndex + 1) % filteredContents.length)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <motion.header
        className="bg-transparent sticky top-0 z-10 backdrop-blur-md transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className={`flex justify-between items-center mb-4 transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
            <div className="w-1/3"></div>
            <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white text-center w-1/3">Enlighten</Link>
            <div className="w-1/3 flex justify-end">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <Input type="text" placeholder="Search content..." className="pl-10 pr-4 py-2 w-full rounded-full dark:bg-gray-700 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
            >
              <Tabs defaultValue="all" className="w-full max-w-2xl" onValueChange={setActiveTab}>
                <TabsList className="w-full justify-center bg-transparent">
                  {['all', 'article', 'video', 'project', 'repository'].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-sm px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Featured Post</h2>
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
            <FeaturedCard key={filteredContents[featuredPostIndex].id} content={filteredContents[featuredPostIndex]} />
          </AnimatePresence>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Latest Content</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {filteredContents.map((content, index) => (
              <ContentCard key={content.id} content={content} index={index} />
            ))}
          </motion.div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full">
              Load More Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="bg-blue-600 dark:bg-blue-800 text-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Get the latest articles, videos, and news delivered straight to your inbox.</p>
          <form className="flex gap-4">
            <Input type="email" placeholder="Enter your email" className="flex-grow dark:bg-gray-700 rounded-full" />
            <Button type="submit" className="rounded-full">Subscribe</Button>
          </form>
        </section>
      </main>

      <footer className="bg-transparent text-gray-800 dark:text-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Author"
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">John Doe</h2>
              <p className="text-lg mb-6 max-w-2xl">
                Passionate web developer and designer with over 10 years of experience. 
                Specializing in creating modern, responsive, and user-friendly websites.
              </p>
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
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                    aria-label={platform.label}
                  >
                    <platform.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <nav className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-0">
              {['Home', 'About', 'Projects', 'Blog', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} John Doe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeaturedCard({ content }: { content: Content }) {
  return (
    <motion.div
      key={content.id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <Link href={`/content/${content.id}`}>
        <Card className="bg-white dark:bg-gray-800 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <Image src={content.image} alt={content.title} width={600} height={400} className="h-48 w-full object-cover md:h-full md:w-48" />
            </div>
            <div className="p-6 md:pl-16 flex flex-col justify-between w-full">
              <div>
                <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">{content.category}</div>
                <h3 className="mt-1 text-xl leading-tight font-medium text-gray-900 dark:text-white">{content.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300">{content.excerpt}</p>
              </div>
              <div className="mt-4 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>{content.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 dark:text-white mr-4">{content.author.name}</span>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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
  )
}

function ContentCard({ content, index }: { content: Content; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 }}
    >
      <Link href={`/content/${content.id}`}>
        <Card className="bg-white dark:bg-gray-800 h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg transform hover:scale-105">
          <CardHeader className="p-4">
            <Image src={content.image} alt={content.title} width={600} height={400} className="w-full h-48 object-cover rounded-md mb-4" />
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{content.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mb-2">{content.excerpt}</CardDescription>
            <div className="text-xs text-blue-500 font-semibold uppercase mb-2">{content.category}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>{content.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 dark:text-gray-300">{content.author.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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
  )
}