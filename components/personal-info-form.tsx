"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { validatePersonalInfo, type ValidationError } from "@/lib/validation"
import type { ResumeData } from "@/app/page"

interface PersonalInfoFormProps {
  data: ResumeData["personalInfo"]
  onChange: (data: Partial<ResumeData["personalInfo"]>) => void
  resumeData?: ResumeData
  onValidationChange?: (isValid: boolean) => void
}

export function PersonalInfoForm({ data, onChange, resumeData, onValidationChange }: PersonalInfoFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateAndUpdate = (newData: Partial<ResumeData["personalInfo"]>) => {
    const updatedData = { ...data, ...newData }
    onChange(newData)

    const validationErrors = validatePersonalInfo(updatedData)
    setErrors(validationErrors)
    onValidationChange?.(validationErrors.length === 0)
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const validationErrors = validatePersonalInfo(data)
    setErrors(validationErrors)
  }

  const getFieldError = (field: string) => {
    return touched[field] ? errors.find((error) => error.field === field)?.message : undefined
  }

  const generateSummary = async () => {
    if (!resumeData) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
        }),
      })

      if (response.ok) {
        const { summary } = await response.json()
        validateAndUpdate({ summary })
      } else {
        console.error("Failed to generate summary")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => validateAndUpdate({ fullName: e.target.value })}
            onBlur={() => handleBlur("fullName")}
            placeholder="John Doe"
            className={`border-gray-200 focus:border-blue-500 ${getFieldError("fullName") ? "border-red-500" : ""}`}
          />
          {getFieldError("fullName") && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("fullName")}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => validateAndUpdate({ email: e.target.value })}
            onBlur={() => handleBlur("email")}
            placeholder="john@example.com"
            className={`border-gray-200 focus:border-blue-500 ${getFieldError("email") ? "border-red-500" : ""}`}
          />
          {getFieldError("email") && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("email")}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => validateAndUpdate({ phone: e.target.value })}
            onBlur={() => handleBlur("phone")}
            placeholder="+1 (555) 123-4567"
            className={`border-gray-200 focus:border-blue-500 ${getFieldError("phone") ? "border-red-500" : ""}`}
          />
          {getFieldError("phone") && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("phone")}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => validateAndUpdate({ location: e.target.value })}
            placeholder="New York, NY"
            className="border-gray-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn</Label>
          <Input
            id="linkedIn"
            value={data.linkedIn}
            onChange={(e) => validateAndUpdate({ linkedIn: e.target.value })}
            onBlur={() => handleBlur("linkedIn")}
            placeholder="linkedin.com/in/johndoe"
            className={`border-gray-200 focus:border-blue-500 ${getFieldError("linkedIn") ? "border-red-500" : ""}`}
          />
          {getFieldError("linkedIn") && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("linkedIn")}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => validateAndUpdate({ website: e.target.value })}
            onBlur={() => handleBlur("website")}
            placeholder="johndoe.com"
            className={`border-gray-200 focus:border-blue-500 ${getFieldError("website") ? "border-red-500" : ""}`}
          />
          {getFieldError("website") && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("website")}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
            onClick={generateSummary}
            disabled={isGenerating || !data.fullName}
          >
            {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => validateAndUpdate({ summary: e.target.value })}
          placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
          className="min-h-[100px] border-gray-200 focus:border-blue-500 resize-none"
        />
        {!data.fullName && <p className="text-sm text-gray-500">Add your name first to enable AI summary generation</p>}
      </div>
    </div>
  )
}
