"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { validateExperience, type ValidationError } from "@/lib/validation"
import type { ResumeData } from "@/app/page"

interface ExperienceFormProps {
  data: ResumeData["experience"]
  onChange: (data: ResumeData["experience"]) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [enhancingId, setEnhancingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, ValidationError[]>>({})
  const [touched, setTouched] = useState<Record<string, Record<string, boolean>>>({})

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...data, newExperience])
  }

  const updateExperience = (id: string, updates: Partial<ResumeData["experience"][0]>) => {
    const updatedData = data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    onChange(updatedData)

    // Validate the updated experience
    const experience = updatedData.find((exp) => exp.id === id)
    if (experience) {
      const validationErrors = validateExperience(experience)
      setErrors((prev) => ({ ...prev, [id]: validationErrors }))
    }
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
    setTouched((prev) => {
      const newTouched = { ...prev }
      delete newTouched[id]
      return newTouched
    })
  }

  const handleBlur = (id: string, field: string) => {
    setTouched((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: true },
    }))

    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      const validationErrors = validateExperience(experience)
      setErrors((prev) => ({ ...prev, [id]: validationErrors }))
    }
  }

  const getFieldError = (id: string, field: string) => {
    const experienceErrors = errors[id] || []
    const fieldTouched = touched[id]?.[field]
    return fieldTouched ? experienceErrors.find((error) => error.field === field)?.message : undefined
  }

  const enhanceDescription = async (id: string) => {
    const experience = data.find((exp) => exp.id === id)
    if (!experience || !experience.description || !experience.position) return

    setEnhancingId(id)
    try {
      const response = await fetch("/api/ai/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: experience.description,
          position: experience.position,
          company: experience.company,
          type: "experience",
        }),
      })

      if (response.ok) {
        const { enhancedDescription } = await response.json()
        updateExperience(id, { description: enhancedDescription })
      } else {
        console.error("Failed to enhance description")
      }
    } catch (error) {
      console.error("Error enhancing description:", error)
    } finally {
      setEnhancingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          onClick={addExperience}
          size="sm"
          variant="outline"
          className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            <Button onClick={addExperience} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((experience) => (
            <Card key={experience.id} className="border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Experience Entry</CardTitle>
                  <Button
                    onClick={() => removeExperience(experience.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
                      onBlur={() => handleBlur(experience.id, "company")}
                      placeholder="Company Name"
                      className={`border-gray-200 focus:border-blue-500 ${getFieldError(experience.id, "company") ? "border-red-500" : ""}`}
                    />
                    {getFieldError(experience.id, "company") && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError(experience.id, "company")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      value={experience.position}
                      onChange={(e) => updateExperience(experience.id, { position: e.target.value })}
                      onBlur={() => handleBlur(experience.id, "position")}
                      placeholder="Job Title"
                      className={`border-gray-200 focus:border-blue-500 ${getFieldError(experience.id, "position") ? "border-red-500" : ""}`}
                    />
                    {getFieldError(experience.id, "position") && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError(experience.id, "position")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                      onBlur={() => handleBlur(experience.id, "startDate")}
                      className={`border-gray-200 focus:border-blue-500 ${getFieldError(experience.id, "startDate") ? "border-red-500" : ""}`}
                    />
                    {getFieldError(experience.id, "startDate") && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError(experience.id, "startDate")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>End Date {!experience.current && "*"}</Label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                      onBlur={() => handleBlur(experience.id, "endDate")}
                      disabled={experience.current}
                      className={`border-gray-200 focus:border-blue-500 ${getFieldError(experience.id, "endDate") ? "border-red-500" : ""}`}
                    />
                    {getFieldError(experience.id, "endDate") && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {getFieldError(experience.id, "endDate")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) =>
                      updateExperience(experience.id, {
                        current: checked as boolean,
                        endDate: checked ? "" : experience.endDate,
                      })
                    }
                  />
                  <Label htmlFor={`current-${experience.id}`} className="text-sm">
                    I currently work here
                  </Label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Job Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      onClick={() => enhanceDescription(experience.id)}
                      disabled={enhancingId === experience.id || !experience.description || !experience.position}
                    >
                      {enhancingId === experience.id ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      {enhancingId === experience.id ? "Enhancing..." : "AI Enhance"}
                    </Button>
                  </div>
                  <Textarea
                    value={experience.description}
                    onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
                    placeholder="Describe your responsibilities, achievements, and impact in this role..."
                    className="min-h-[100px] border-gray-200 focus:border-blue-500 resize-none"
                  />
                  {!experience.position && (
                    <p className="text-sm text-gray-500">Add position title first to enable AI enhancement</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
