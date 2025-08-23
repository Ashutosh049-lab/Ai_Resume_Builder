"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Sparkles, Loader2 } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface SkillsFormProps {
  data: ResumeData["skills"]
  onChange: (data: ResumeData["skills"]) => void
  resumeData?: ResumeData
}

export function SkillsForm({ data, onChange, resumeData }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "technical" as const,
    level: "intermediate" as const,
  })
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState("")

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        id: Date.now().toString(),
        ...newSkill,
      }
      onChange([...data, skill])
      setNewSkill({ name: "", category: "technical", level: "intermediate" })
    }
  }

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const suggestSkills = async () => {
    if (!resumeData) return

    setIsSuggesting(true)
    try {
      const response = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: resumeData.experience,
          education: resumeData.education,
          currentSkills: data,
        }),
      })

      if (response.ok) {
        const { suggestions: skillSuggestions } = await response.json()
        setSuggestions(skillSuggestions)
      } else {
        console.error("Failed to suggest skills")
      }
    } catch (error) {
      console.error("Error suggesting skills:", error)
    } finally {
      setIsSuggesting(false)
    }
  }

  const skillsByCategory = {
    technical: data.filter((skill) => skill.category === "technical"),
    soft: data.filter((skill) => skill.category === "soft"),
    language: data.filter((skill) => skill.category === "language"),
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-yellow-100 text-yellow-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-green-100 text-green-800"
      case "expert":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
          onClick={suggestSkills}
          disabled={isSuggesting}
        >
          {isSuggesting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
          {isSuggesting ? "Suggesting..." : "AI Suggest"}
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestions && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="font-medium text-blue-900 mb-2">AI Skill Suggestions</h4>
          <Textarea value={suggestions} readOnly className="min-h-[120px] bg-white border-blue-200 text-sm" />
          <p className="text-xs text-blue-700 mt-2">
            Review these suggestions and manually add the skills that are relevant to your experience.
          </p>
        </div>
      )}

      {/* Add New Skill */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label>Skill Name</Label>
            <Input
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., React, Leadership, Spanish"
              className="border-gray-200 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={newSkill.category}
              onValueChange={(value: any) => setNewSkill({ ...newSkill, category: value })}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
                <SelectItem value="language">Language</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill({ ...newSkill, level: value })}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Skills Display */}
      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-gray-900 capitalize">
              {category === "technical" ? "Technical Skills" : category === "soft" ? "Soft Skills" : "Languages"}
            </h4>
            {skills.length === 0 ? (
              <p className="text-gray-500 text-sm">No {category} skills added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className={`${getLevelColor(skill.level)} flex items-center gap-2 px-3 py-1`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-xs opacity-75">({skill.level})</span>
                    <button onClick={() => removeSkill(skill.id)} className="ml-1 hover:bg-black/10 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
