"use client"
import type { ResumeData } from "@/app/page"
import { ModernTemplate } from "@/components/templates/modern-template"
import { ClassicTemplate } from "@/components/templates/classic-template"
import { CreativeTemplate } from "@/components/templates/creative-template"
import { MinimalTemplate } from "@/components/templates/minimal-template"
import { ExecutiveTemplate } from "@/components/templates/executive-template"
import { TechTemplate } from "@/components/templates/tech-template"

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export function ResumePreview({ data, template = "modern" }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />
      case "creative":
        return <CreativeTemplate data={data} />
      case "minimal":
        return <MinimalTemplate data={data} />
      case "executive":
        return <ExecutiveTemplate data={data} />
      case "tech":
        return <TechTemplate data={data} />
      default:
        return <ModernTemplate data={data} />
    }
  }

  return <div className="w-full">{renderTemplate()}</div>
}
