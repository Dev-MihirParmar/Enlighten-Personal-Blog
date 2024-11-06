'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pencil, Trash2, Users, Sun, Moon, Eye, Heart, Bookmark, LogOut } from 'lucide-react'
import { AdminLogin } from './admin-login'

// Mock data for content items (in a real app, this would come from an API)
const contentItems = [
  { id: '1', title: 'The Future of Web Development', type: 'Article', date: '2023-10-18', status: 'Published', views: 1500, likes: 120, bookmarks: 45 },
  { id: '2', title: 'Building a React Native App', type: 'Video', date: '2023-09-10', status: 'Draft', views: 0, likes: 0, bookmarks: 0 },
  { id: '3', title: 'Machine Learning Chatbot', type: 'Article', date: '2023-09-05', status: 'Published', views: 800, likes: 67, bookmarks: 23 },
  { id: '4', title: 'Advanced CSS Techniques', type: 'Video', date: '2023-09-01', status: 'Published', views: 5000, likes: 250, bookmarks: 180 },
]

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    const authStatus = localStorage.getItem('adminAuthenticated') === 'true'
    setDarkMode(isDarkMode)
    setIsAuthenticated(authStatus)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', (!darkMode).toString())
    document.documentElement.classList.toggle('dark')
  }

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
  }

  const navigateToEditor = (type: string, id?: string) => {
    if (id) {
      router.push(`/${type.toLowerCase()}s/${id}/edit`)
    } else {
      router.push(`/${type.toLowerCase()}s/new`)
    }
  }

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call to delete the content
    console.log(`Deleting content with id: ${id}`)
    // Then update the UI accordingly
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] ${darkMode ? 'bg-gray-900/75' : 'bg-white/75'}`}>
        <div className="max-w-8xl mx-auto">
          <div className="py-4 border-b border-gray-900/10 lg:px-8 lg:border-0 dark:border-gray-300/10 mx-4 lg:mx-0">
            <div className="relative flex items-center">
              <a className="mr-3 flex-none overflow-hidden md:w-auto" href="/">
                <span className="sr-only">Enlighten Admin</span>
                <div className="flex items-center">
                  <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Enlighten</span>
                </div>
              </a>
              <div className="relative flex items-center ml-auto">
                <nav className="text-sm leading-6 font-semibold text-gray-700 dark:text-gray-200">
                  <ul className="flex space-x-8">
                    <li><a className="hover:text-gray-900 dark:hover:text-white" href="/admin">Dashboard</a></li>
                    <li><a className="hover:text-gray-900 dark:hover:text-white" href="/admin/content">Content</a></li>
                    <li><a className="hover:text-gray-900 dark:hover:text-white" href="/admin/users">Users</a></li>
                    <li><a className="hover:text-gray-900 dark:hover:text-white" href="/admin/settings">Settings</a></li>
                  </ul>
                </nav>
                <div className="flex items-center border-l border-gray-200 ml-6 pl-6 dark:border-gray-800">
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  </Button>
                  <Avatar className="ml-4">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-2">
                    <LogOut className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Here's what's happening with your site today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,300</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">437</div>
              <p className="text-xs text-muted-foreground">+15.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">+7.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="col-span-full md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Select a content type to create</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button onClick={() => navigateToEditor('Article')} className="h-20 text-lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Article
              </Button>
              <Button onClick={() => navigateToEditor('Video')} className="h-20 text-lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Video
              </Button>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest published and draft content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Published' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.views}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => navigateToEditor(item.type, item.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
              <CardDescription>Adjust your site settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input id="site-title" defaultValue="Enlighten" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea id="site-description" defaultValue="A blog about web development and technology." />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Your site's performance this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                Analytics chart placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}