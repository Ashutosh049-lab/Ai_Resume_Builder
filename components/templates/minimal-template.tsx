"use client"
import type { ResumeData } from "@/app/page"

interface MinimalTemplateProps {
  data: ResumeData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white min-h-[800px] p-12 shadow-sm border border-gray-100 font-sans text-sm leading-loose">
      {/* Header with minimal styling */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-black mb-6 tracking-wide">
          {data.personalInfo.fullName || "Your Name"}
        </h1>

        <div className="space-y-1 text-gray-600">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          {data.personalInfo.linkedIn && <p>{data.personalInfo.linkedIn}</p>}
          {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-black mb-4 uppercase tracking-widest">Summary</h2>
          <p className="text-gray-700 leading-loose max-w-2xl">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-black mb-6 uppercase tracking-widest">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="font-medium text-black">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-right">
                    <p className="text-sm">
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.description && <p className="text-gray-700 mt-3 leading-loose max-w-2xl">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-black mb-6 uppercase tracking-widest">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-black">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-gray-500 text-right">
                  <p className="text-sm">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium text-black mb-6 uppercase tracking-widest">Skills</h2>
          <div className="space-y-4">
            {["technical", "soft", "language"].map((category) => {
              const categorySkills = data.skills.filter((skill) => skill.category === category)
              if (categorySkills.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="font-medium text-gray-800 mb-2 text-sm uppercase tracking-wide">
                    {category === "technical" ? "Technical" : category === "soft" ? "Soft Skills" : "Languages"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="text-gray-700 text-sm">
                        {skill.name}
                      </span>
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
