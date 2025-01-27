"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"

interface Template {
  id: string
  title: string
  description: string
  image: string
  category: string
  features: string[]
}

export default function TemplateGrid() {
  const [templates, setTemplates] = useState<Template[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/api/template/all")
        setTemplates(response.data)
      } catch (error) {
        console.error("Error fetching templates:", error)
      }
    }
    fetchTemplates()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => router.push(`/admin/template/${template.id}`)}
          className="group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out border-gray-100 dark:border-gray-700 hover:border-violet-400 hover:scale-[1.02]"
        >
          <div className="relative aspect-video w-full">
            <img
              src={template.image || "/placeholder.svg"}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.title}</h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {template.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

