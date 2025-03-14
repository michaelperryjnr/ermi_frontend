"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, ImageIcon, PlusCircle, Trash2 } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock data - would come from your API/database in production
  const recentSermons = [
    { id: 1, title: "Finding Peace in Troubled Times", date: "2025-03-10", speaker: "Pastor Johnson", downloads: 45 },
    { id: 2, title: "The Power of Prayer", date: "2025-03-03", speaker: "Pastor Johnson", downloads: 38 },
    { id: 3, title: "Walking in Faith", date: "2025-02-24", speaker: "Elder Smith", downloads: 52 },
  ]

  const recentEvents = [
    { id: 1, title: "Youth Retreat", date: "2025-04-15", registrations: 28 },
    { id: 2, title: "Women's Conference", date: "2025-05-10", registrations: 45 },
    { id: 3, title: "Men's Breakfast", date: "2025-03-22", registrations: 15 },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {isAuthenticated ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your church content, events, and more</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => setIsAuthenticated(false)}>Sign Out</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground mt-1">Next: Youth Retreat (Apr 15)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Building Fund</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$350,000</div>
                  <p className="text-xs text-muted-foreground mt-1">70% of $500,000 goal</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="devotionals" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
                <TabsTrigger value="sermons">Sermons</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="devotionals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Devotional</CardTitle>
                    <CardDescription>Add a new daily devotional for the church</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="devotional-title">Title</Label>
                      <Input id="devotional-title" placeholder="Enter devotional title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devotional-verse">Bible Verse</Label>
                      <Input id="devotional-verse" placeholder="e.g., John 3:16" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devotional-verse-text">Verse Text</Label>
                      <Textarea id="devotional-verse-text" placeholder="Enter the full verse text" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devotional-content">Content</Label>
                      <Textarea id="devotional-content" placeholder="Write the devotional content" rows={6} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devotional-author">Author</Label>
                      <Input id="devotional-author" placeholder="Enter author name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devotional-date">Publish Date</Label>
                      <Input id="devotional-date" type="date" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Publish Devotional</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Devotionals</CardTitle>
                    <CardDescription>Manage your published devotionals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Finding Peace in Troubled Times</TableCell>
                          <TableCell>Mar 13, 2025</TableCell>
                          <TableCell>Pastor Johnson</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">The Power of Gratitude</TableCell>
                          <TableCell>Mar 12, 2025</TableCell>
                          <TableCell>Elder Smith</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Walking in Faith</TableCell>
                          <TableCell>Mar 11, 2025</TableCell>
                          <TableCell>Deacon Williams</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sermons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Sermon</CardTitle>
                    <CardDescription>Add a new sermon recording or document</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sermon-title">Title</Label>
                      <Input id="sermon-title" placeholder="Enter sermon title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sermon-speaker">Speaker</Label>
                      <Input id="sermon-speaker" placeholder="Enter speaker name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sermon-date">Date</Label>
                      <Input id="sermon-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sermon-scripture">Scripture Reference</Label>
                      <Input id="sermon-scripture" placeholder="e.g., Matthew 5:1-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sermon-description">Description</Label>
                      <Textarea id="sermon-description" placeholder="Enter a brief description of the sermon" />
                    </div>
                    <div className="space-y-2">
                      <Label>Audio File</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your audio file here, or click to browse
                        </p>
                        <Input id="sermon-file" type="file" className="hidden" />
                        <Button variant="outline" onClick={() => document.getElementById("sermon-file")?.click()}>
                          Select File
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Upload Sermon</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sermons</CardTitle>
                    <CardDescription>Manage your uploaded sermons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Speaker</TableHead>
                          <TableHead>Downloads</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSermons.map((sermon) => (
                          <TableRow key={sermon.id}>
                            <TableCell className="font-medium">{sermon.title}</TableCell>
                            <TableCell>{formatDate(sermon.date)}</TableCell>
                            <TableCell>{sermon.speaker}</TableCell>
                            <TableCell>{sermon.downloads}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Add a new event to the church calendar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" placeholder="Enter event title" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input id="event-location" placeholder="Enter event location" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-department">Department</Label>
                      <Select>
                        <SelectTrigger id="event-department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="main-youth">Main Youth</SelectItem>
                          <SelectItem value="teen-youth">Teen Youth</SelectItem>
                          <SelectItem value="womens-fellowship">Women's Fellowship</SelectItem>
                          <SelectItem value="mens-fellowship">Men's Fellowship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea id="event-description" placeholder="Enter event description" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Event Image</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your image here, or click to browse
                        </p>
                        <Input id="event-image" type="file" className="hidden" />
                        <Button variant="outline" onClick={() => document.getElementById("event-image")?.click()}>
                          Select Image
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-recurring" className="rounded border-gray-300" />
                      <Label htmlFor="event-recurring">This is a recurring event</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Create Event</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Manage your scheduled events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Registrations</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{formatDate(event.date)}</TableCell>
                            <TableCell>{event.registrations}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Images</CardTitle>
                    <CardDescription>Add new images to the church gallery</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-title">Album Title</Label>
                      <Input id="gallery-title" placeholder="Enter album title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-department">Department</Label>
                      <Select>
                        <SelectTrigger id="gallery-department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="main-youth">Main Youth</SelectItem>
                          <SelectItem value="teen-youth">Teen Youth</SelectItem>
                          <SelectItem value="womens-fellowship">Women's Fellowship</SelectItem>
                          <SelectItem value="mens-fellowship">Men's Fellowship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-description">Description</Label>
                      <Textarea id="gallery-description" placeholder="Enter album description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gallery-date">Event Date</Label>
                      <Input id="gallery-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Images</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your images here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">You can upload multiple images at once</p>
                        <Input id="gallery-images" type="file" multiple className="hidden" />
                        <Button variant="outline" onClick={() => document.getElementById("gallery-images")?.click()}>
                          Select Images
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Upload to Gallery</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Manage Gallery</CardTitle>
                    <CardDescription>Organize and edit your gallery albums</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src="/placeholder.svg?height=400&width=600"
                              alt="Sunday Service"
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-white hover:bg-white/20 hover:text-white"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-white hover:bg-white/20 hover:text-white"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">Sunday Service</h3>
                            <p className="text-sm text-muted-foreground">March 10, 2025</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src="/placeholder.svg?height=400&width=600"
                              alt="Youth Retreat"
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-white hover:bg-white/20 hover:text-white"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-white hover:bg-white/20 hover:text-white"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">Youth Retreat</h3>
                            <p className="text-sm text-muted-foreground">February 15, 2025</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="flex flex-col items-center justify-center h-full border-dashed">
                        <CardContent className="text-center py-8">
                          <PlusCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="font-medium">Create New Album</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Sign in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin} className="w-full">
                Sign In
              </Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

