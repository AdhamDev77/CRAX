"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TemplateList() {
  const [templates, setTemplates] = useState([])

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template: any) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle>{template.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={template.image || "/placeholder.svg"}
              alt={template.title}
              className="w-full h-40 object-cover mb-2"
            />
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <div className="flex flex-wrap gap-2">
              {template.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/admin/template/${template.id}`} className="text-blue-600 hover:underline">
              View Template
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

