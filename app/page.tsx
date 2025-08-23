"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Sparkles, Palette } from "lucide-react"
import { ResumePreview } from "@/components/resume-preview"
import { TemplateSelector } from "@/components/template-selector"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { ExperienceForm } from "@/components/experience-form"
import { EducationForm } from "@/components/education-form"
import { SkillsForm } from "@/components/skills-form"
import { ExportDropdown } from "@/components/export-dropdown"
import { ProgressIndicator } from "@/components/progress-indicator"
import { ToastContainer, useToast } from "@/components/ui/toast"

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
    linkedIn?: string
    website?: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    name: string
    category: "technical" | "soft" | "language"
    level: "beginner" | "intermediate" | "advanced" | "expert"
  }>
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedIn: "",
      website: "",
    },
    experience: [],
    education: [],
    skills: [],
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false)
  const { toasts, addToast } = useToast()

  const updatePersonalInfo = (info: Partial<ResumeData["personalInfo"]>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }))
  }

  const updateExperience = (experience: ResumeData["experience"]) => {
    setResumeData((prev) => ({ ...prev, experience }))
  }

  const updateEducation = (education: ResumeData["education"]) => {
    setResumeData((prev) => ({ ...prev, education }))
  }

  const updateSkills = (skills: ResumeData["skills"]) => {
    setResumeData((prev) => ({ ...prev, skills }))
  }

  const handleGlobalAIEnhance = async () => {
    if (!isPersonalInfoValid) {
      addToast({
        type: "warning",
        title: "Missing Information",
        description: "Please complete your personal information first.",
      })
      setActiveTab("personal")
      return
    }

    addToast({
      type: "info",
      title: "AI Enhancement",
      description: "This feature will enhance your entire resume. Coming soon!",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Resume Builder</h1>
                <p className="text-sm text-gray-500">Create professional resumes with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportDropdown resumeData={resumeData} selectedTemplate={selectedTemplate} />
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={handleGlobalAIEnhance}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Enhance
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <ProgressIndicator resumeData={resumeData} activeTab={activeTab} />

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Build Your Resume
                </CardTitle>
                <p className="text-gray-600">Fill in your information and let AI help you create the perfect resume</p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="personal" className="text-sm">
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="text-sm">
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="text-sm">
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="text-sm">
                      Skills
                    </TabsTrigger>
                    <TabsTrigger value="template" className="text-sm">
                      <Palette className="w-3 h-3 mr-1" />
                      Template
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <PersonalInfoForm
                      data={resumeData.personalInfo}
                      onChange={updatePersonalInfo}
                      resumeData={resumeData}
                      onValidationChange={setIsPersonalInfoValid}
                    />
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <ExperienceForm data={resumeData.experience} onChange={updateExperience} />
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <EducationForm data={resumeData.education} onChange={updateEducation} />
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <SkillsForm data={resumeData.skills} onChange={updateSkills} resumeData={resumeData} />
                  </TabsContent>

                  <TabsContent value="template" className="space-y-4">
                    <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Live Preview</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Auto-updating
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ResumePreview data={resumeData} template={selectedTemplate} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
