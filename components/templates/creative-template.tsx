"use client"

import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface CreativeTemplateProps {
  data: ResumeData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-pink-100 text-pink-800"
      case "intermediate":
        return "bg-purple-100 text-purple-800"
      case "advanced":
        return "bg-indigo-100 text-indigo-800"
      case "expert":
        return "bg-violet-100 text-violet-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-[800px] p-8 shadow-sm border border-purple-100 font-sans text-sm leading-relaxed">
      {/* Header with creative styling */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-3">{data.personalInfo.fullName || "Your Name"}</h1>

        <div className="flex flex-wrap gap-4 text-purple-100">
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

        <div className="flex flex-wrap gap-4 mt-2 text-purple-100">
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
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="relative">
                {index > 0 && <div className="absolute -top-2 left-2 w-0.5 h-4 bg-purple-200"></div>}
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-gray-600 text-right">
                        <p className="text-sm">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </p>
                      </div>
                    </div>
                    {exp.description && <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-purple-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-gray-600 text-right">
                  <p className="text-sm">
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
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-purple-600 mb-3 flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
            Skills & Expertise
          </h2>
          <div className="space-y-3">
            {["technical", "soft", "language"].map((category) => {
              const categorySkills = data.skills.filter((skill) => skill.category === category)
              if (categorySkills.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="font-medium text-gray-800 mb-2 capitalize">
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
