"use client"

import { useRouter } from "@/i18n/routing"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" // For toast notifications
import MediaUploader from "@/components/MediaUploader" // Import the MediaUploader component
import { useState, useEffect } from "react"

interface CreateTemplateFormProps {
  formData: {
    title: string
    description: string
    content: string
    image: string
    category: string
    features: string
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string
      description: string
      content: string
      image: string
      category: string
      features: string
    }>
  >
}

export default function CreateTemplateForm({ formData, setFormData }: CreateTemplateFormProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/api/template/all")
        setTemplates(response.data)
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast.error("Failed to fetch templates. Please try again.")
      }
    }
    fetchTemplates()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = async (templateId: string) => {
    try {
      // Fetch the selected template's content
      const response = await axios.get(`/api/template/${templateId}`)
      const selectedTemplate = response.data

      // Update the form data with the selected template's content
      setFormData((prev) => ({
        ...prev,
        content: selectedTemplate.content, // Clone the content
      }))

      toast.success(`Content cloned from "${selectedTemplate.title}"`)
    } catch (error) {
      console.error("Error fetching template content:", error)
      toast.error("Failed to clone content. Please try again.")
    }
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post("/api/template", {
        ...formData,
        features: formData.features.split(",").map((f) => f.trim()),
      })
      toast.success("Template created successfully!")
      router.push("/admin")
    } catch (error) {
      console.error("Error creating template:", error)
      toast.error("Failed to create template. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Clone Content From */}
      <div>
        <Label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Clone Content From
        </Label>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <SelectValue placeholder="Select a template to clone" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template: any) => (
              <SelectItem key={template.id} value={template.id}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <div>
        <Label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Image
        </Label>
        <MediaUploader
          withMediaLibrary={true}
          withUnsplash={true}
          onImageSelect={handleImageSelect}
          initialImage={formData.image}
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Features */}
      <div>
        <Label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Features (comma-separated)
        </Label>
        <Input
          id="features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/50"
      >
        {isSubmitting ? "Creating..." : "Create Template"}
      </Button>
    </form>
  )
}