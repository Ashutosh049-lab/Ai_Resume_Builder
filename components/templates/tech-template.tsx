"use client"

import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin, Code, Database, Zap } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface TechTemplateProps {
  data: ResumeData
}

export function TechTemplate({ data }: TechTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-cyan-100 text-cyan-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-indigo-100 text-indigo-800"
      case "expert":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <Code className="w-4 h-4" />
      case "soft":
        return <Zap className="w-4 h-4" />
      case "language":
        return <Globe className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-900 min-h-[800px] text-white shadow-sm border border-gray-700 font-mono text-sm leading-relaxed">
      {/* Header with tech styling */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3 font-sans">{data.personalInfo.fullName || "Your Name"}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-cyan-100">
            <div className="space-y-2">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-sans">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-sans">{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-sans">{data.personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {data.personalInfo.linkedIn && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="font-sans">{data.personalInfo.linkedIn}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-sans">{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center font-sans">
              <Code className="w-5 h-5 mr-2" />
              // About
            </h2>
            <p className="text-gray-300 leading-relaxed font-sans">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center font-sans">
              <Database className="w-5 h-5 mr-2" />
              // Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative">
                  <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs">[{index + 1}]</div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-white font-sans text-base">{exp.position}</h3>
                      <p className="text-cyan-400 font-sans">{exp.company}</p>
                    </div>
                    <div className="text-gray-400 text-right">
                      <p className="font-mono text-xs">
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-300 mt-3 leading-relaxed font-sans">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center font-sans">
              <Zap className="w-5 h-5 mr-2" />
              // Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white font-sans">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-cyan-400 font-sans">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-400 font-mono text-xs">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-gray-400 text-right">
                      <p className="font-mono text-xs">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center font-sans">
              <Code className="w-5 h-5 mr-2" />
              // Skills
            </h2>
            <div className="space-y-4">
              {["technical", "soft", "language"].map((category) => {
                const categorySkills = data.skills.filter((skill) => skill.category === category)
                if (categorySkills.length === 0) return null

                return (
                  <div key={category} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-white mb-3 flex items-center font-sans text-sm">
                      {getCategoryIcon(category)}
                      <span className="ml-2">
                        {category === "technical"
                          ? "Technical Stack"
                          : category === "soft"
                            ? "Soft Skills"
                            : "Languages"}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className={`${getLevelColor(skill.level)} text-xs font-mono`}
                        >
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
      </div>

      {/* Empty State */}
      {!data.personalInfo.fullName &&
        data.experience.length === 0 &&
        data.education.length === 0 &&
        data.skills.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2 font-sans">Your resume preview will appear here</p>
              <p className="text-sm font-sans">Start filling out your information to see the live preview</p>
            </div>
          </div>
        )}
    </div>
  )
}
