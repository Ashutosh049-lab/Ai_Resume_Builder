"use client"

import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ClassicTemplateProps {
  data: ResumeData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-gray-100 text-gray-700"
      case "intermediate":
        return "bg-gray-200 text-gray-800"
      case "advanced":
        return "bg-gray-300 text-gray-900"
      case "expert":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="bg-white min-h-[800px] p-8 shadow-sm border border-gray-100 font-serif text-sm leading-relaxed">
      {/* Header with traditional styling */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-wide">
          {data.personalInfo.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-6 text-gray-700">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-2 text-gray-700">
          {data.personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>{data.personalInfo.linkedIn}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-wide">{exp.position}</h3>
                    <p className="text-gray-700 italic">{exp.company}</p>
                  </div>
                  <div className="text-gray-600 text-right">
                    <p className="font-medium">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mt-2 leading-relaxed text-justify">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700 italic">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-gray-600 text-right">
                  <p className="font-medium">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-400 pb-1">
            Core Competencies
          </h2>
          <div className="space-y-3">
            {["technical", "soft", "language"].map((category) => {
              const categorySkills = data.skills.filter((skill) => skill.category === category)
              if (categorySkills.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="font-bold text-gray-800 mb-2 uppercase tracking-wide text-sm">
                    {category === "technical" ? "Technical Skills" : category === "soft" ? "Soft Skills" : "Languages"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className={`${getLevelColor(skill.level)} text-xs`}>
                        {skill.name} ({skill.level})
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!data.personalInfo.fullName &&
        data.experience.length === 0 &&
        data.education.length === 0 &&
        data.skills.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Your resume preview will appear here</p>
              <p className="text-sm">Start filling out your information to see the live preview</p>
            </div>
          </div>
        )}
    </div>
  )
}
