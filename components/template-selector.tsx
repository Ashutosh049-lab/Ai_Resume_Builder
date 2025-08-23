"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with subtle colors",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-50",
    accent: "border-blue-500",
    popular: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout with serif fonts",
    preview: "bg-gradient-to-br from-gray-50 to-slate-100",
    accent: "border-gray-600",
    popular: false,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design with vibrant colors and modern typography",
    preview: "bg-gradient-to-br from-purple-50 to-pink-50",
    accent: "border-purple-500",
    popular: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean design focusing on content and whitespace",
    preview: "bg-white",
    accent: "border-black",
    popular: false,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated layout for senior-level positions",
    preview: "bg-gradient-to-br from-emerald-50 to-teal-50",
    accent: "border-emerald-600",
    popular: false,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Modern design optimized for technical roles",
    preview: "bg-gradient-to-br from-cyan-50 to-blue-50",
    accent: "border-cyan-500",
    popular: false,
  },
]

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Template</h3>
        <p className="text-gray-600 text-sm">Select a template that matches your industry and personal style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate === template.id
                ? `ring-2 ring-blue-500 ${template.accent} border-2`
                : "border border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {template.popular && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                {selectedTemplate === template.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              {/* Template Preview */}
              <div className={`w-full h-32 rounded-lg border ${template.preview} p-3 relative overflow-hidden`}>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                  <div className="h-1 bg-gray-400 rounded w-1/2"></div>
                  <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                  <div className="space-y-1 mt-3">
                    <div className="h-2 bg-gray-600 rounded w-1/3"></div>
                    <div className="h-1 bg-gray-300 rounded w-full"></div>
                    <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
