"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"
import { calculateCompletionPercentage } from "@/lib/validation"
import type { ResumeData } from "@/app/page"

interface ProgressIndicatorProps {
  resumeData: ResumeData
  activeTab: string
}

export function ProgressIndicator({ resumeData, activeTab }: ProgressIndicatorProps) {
  const completionPercentage = calculateCompletionPercentage(resumeData)

  const sections = [
    {
      id: "personal",
      name: "Personal Info",
      completed: !!(resumeData.personalInfo.fullName && resumeData.personalInfo.email),
    },
    {
      id: "experience",
      name: "Experience",
      completed: resumeData.experience.length > 0,
    },
    {
      id: "education",
      name: "Education",
      completed: resumeData.education.length > 0,
    },
    {
      id: "skills",
      name: "Skills",
      completed: resumeData.skills.length > 0,
    },
    {
      id: "template",
      name: "Template",
      completed: true, // Always completed since default is selected
    },
  ]

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Resume Progress</h3>
        <span className="text-sm font-medium text-blue-600">{completionPercentage}% Complete</span>
      </div>

      <Progress value={completionPercentage} className="mb-4" />

      <div className="grid grid-cols-5 gap-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === section.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
            }`}
          >
            {section.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 mb-1" />
            )}
            <span className="text-xs text-center text-gray-600">{section.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
