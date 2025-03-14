"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash, Upload } from "lucide-react"

// Mock data - in a real app, this would come from your database
const mockSermons = [
  {
    id: 1,
    title: "Walking in Faith",
    preacher: "Pastor John Doe",
    date: "2025-03-10",
    videoUrl: "https://example.com/video1",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    preacher: "Pastor Jane Smith",
    date: "2025-03-03",
    videoUrl: "https://example.com/video2",
  },
  {
    id: 3,
    title: "Finding Peace in Troubled Times",
    preacher: "Pastor John Doe",
    date: "2025-02-24",
    videoUrl: "https://example.com/video3",
  },
]

export default function AdminSermons() {
  const [sermons, setSermons] = useState(mockSermons)
  const [isAddingSermon, setIsAddingSermon] = useState(false)
  const [editingSermonId, setEditingSermonId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    preacher: "",
    date: "",
    videoUrl: "",
    description: "",
    thumbnailFile: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, thumbnailFile: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would upload the file and save the sermon to your database

    if (editingSermonId) {
      // Update existing sermon
      setSermons(
        sermons.map((sermon) =>
          sermon.id === editingSermonId
            ? {
                ...sermon,
                title: formData.title,
                preacher: formData.preacher,
                date: formData.date,
                videoUrl: formData.videoUrl,
              }
            : sermon,
        ),
      )
    } else {
      // Add new sermon
      const newSermon = {
        id: sermons.length + 1,
        title: formData.title,
        preacher: formData.preacher,
        date: formData.date,
        videoUrl: formData.videoUrl,
      }
      setSermons([...sermons, newSermon])
    }

    // Reset form
    setFormData({
      title: "",
      preacher: "",
      date: "",
      videoUrl: "",
      description: "",
      thumbnailFile: null,
    })
    setIsAddingSermon(false)
    setEditingSermonId(null)
  }

  const handleEdit = (sermon: (typeof sermons)[0]) => {
    setFormData({
      title: sermon.title,
      preacher: sermon.preacher,
      date: sermon.date,
      videoUrl: sermon.videoUrl,
      description: "",
      thumbnailFile: null,
    })
    setEditingSermonId(sermon.id)
    setIsAddingSermon(true)
  }

  const handleDelete = (id: number) => {
    // In a real app, you would delete from your database
    setSermons(sermons.filter((sermon) => sermon.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Sermons</h2>
        <Button onClick={() => setIsAddingSermon(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Sermon
        </Button>
      </div>

      {isAddingSermon ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingSermonId ? "Edit Sermon" : "Add New Sermon"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Sermon Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preacher">Preacher</Label>
                  <Input
                    id="preacher"
                    name="preacher"
                    value={formData.preacher}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => document.getElementById("thumbnail")?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formData.thumbnailFile ? formData.thumbnailFile.name : "No file chosen"}
                  </span>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingSermon(false)
                    setEditingSermonId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingSermonId ? "Update Sermon" : "Add Sermon"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Preacher</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sermons.map((sermon) => (
                  <TableRow key={sermon.id}>
                    <TableCell className="font-medium">{sermon.title}</TableCell>
                    <TableCell>{sermon.preacher}</TableCell>
                    <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(sermon)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(sermon.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sermons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No sermons found. Add your first sermon.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

