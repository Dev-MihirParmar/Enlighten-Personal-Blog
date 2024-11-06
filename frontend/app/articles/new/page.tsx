"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Meditor from "@/components/Meditor";
import { Calendar, Clock, Search, Sun, Moon, Upload, Save } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateArticlePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set default author details
  const author = {
    name: "Mihir Parmar",
    avatar: "/author.svg?height=400&width=400",
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleCreateArticle = async () => {
    setIsLoading(true);
    const newArticle = {
      title,
      subheading,
      content,
      date,
      readTime,
      category,
      image,
      author,
    };

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        toast.success("New article created successfully!");
        // Reset form
        setTitle("");
        setSubheading("");
        setContent("");
        setDate("");
        setReadTime("");
        setCategory("");
        setImage("");
      } else {
        throw new Error("Failed to create article");
      }
    } catch (error) {
      toast.error("Failed to create article");
    }

    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { filePath } = await response.json();
          setImage(filePath);
          toast.info("Image uploaded successfully!");
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        toast.error("Image upload failed");
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className={`${darkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-900"} transition-colors duration-300`}>
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
                      style={{ borderRadius: "50px" }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  <Button variant="default" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                    {isPreviewMode ? "Back to Edit" : "Preview"}
                  </Button>
                  <Button variant="default" size="sm" onClick={handleCreateArticle} disabled={isLoading}>
                    {isLoading ? "Creating..." : <><Upload className="h-4 w-4 mr-2" /> Publish</>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {isPreviewMode ? (
              // Preview Mode
              <div>
                <header className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">{title}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{subheading}</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={author.avatar} alt={author.name} />
                        <AvatarFallback>{author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{author.name}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{date}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <main>
                  <Image
                    src={image || "/placeholder.svg?height=400&width=800"}
                    alt={title}
                    width={800}
                    height={400}
                    className="rounded-lg mb-8 w-full object-cover"
                  />
                  <article className="prose prose-lg dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />
                </main>
              </div>
            ) : (
              // Edit Mode
              <div>
                <header className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">Create New Article</h1>
                </header>

                <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Article Details</h3>
                  <div className="space-y-4">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title" className="w-full p-2 border rounded-md" />
                    <Input value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Article Subheading" className="w-full p-2 border rounded-md" />
                    <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date (e.g., 2023-10-18)" className="w-full p-2 border rounded-md" />
                    <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="Read Time (e.g., 10 min read)" className="w-full p-2 border rounded-md" />
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-2 border rounded-md" />
                    <div>
                      <label className="block text-sm font-medium mb-2">Cover Image</label>
                      <Input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-md" />
                      {image && (
                        <div className="mt-4">
                          <Image src={image} alt="Cover Image" width={400} height={200} className="rounded-md" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Article Content</label>
                      <Card className="min-h-[400px] p-4 bg-white dark:bg-gray-700">
                        <Meditor content={content} setContent={setContent} />
                      </Card>
                    </div>
                  </div>
                </section>

                <section className="mb-8 flex justify-end items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Button variant="default" size="sm" onClick={handleCreateArticle} disabled={isLoading}>
                    {isLoading ? "Creating..." : <><Save className="h-4 w-4 mr-2" /> Create Article</>}
                  </Button>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className={`${darkMode ? "bg-gray-900 text-gray-400 border-gray-800" : "bg-gray-100 text-gray-600 border-gray-300"} border-t`}>
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex-shrink-0">
                <Image src={author.avatar} alt={author.name} width={200} height={200} className="rounded-full shadow-lg" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{author.name}</h2>
                <p className="text-lg mb-6 max-w-2xl">A passionate developer, coder, and tech enthusiast sharing knowledge and insights about web development and beyond.</p>
              </div>
            </div>
            <div className={`mt-8 text-center text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              &copy; {new Date().getFullYear()} {author.name}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
