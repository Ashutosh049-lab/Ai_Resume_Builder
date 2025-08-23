"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, File, Loader2, ChevronDown } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ExportDropdownProps {
  resumeData: ResumeData
  selectedTemplate: string
}

export function ExportDropdown({ resumeData, selectedTemplate }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const exportToPDF = async () => {
    setIsExporting("pdf")
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template: selectedTemplate,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resumeData.personalInfo.fullName || "resume"}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Failed to export PDF")
      }
    } catch (error) {
      console.error("Error exporting PDF:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const exportToWord = async () => {
    setIsExporting("word")
    try {
      const response = await fetch("/api/export/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template: selectedTemplate,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resumeData.personalInfo.fullName || "resume"}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Failed to export Word document")
      }
    } catch (error) {
      console.error("Error exporting Word document:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const hasContent =
    resumeData.personalInfo.fullName ||
    resumeData.experience.length > 0 ||
    resumeData.education.length > 0 ||
    resumeData.skills.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasContent || isExporting !== null}
          className="flex items-center gap-2 bg-transparent"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={exportToPDF}
          disabled={!hasContent || isExporting !== null}
          className="flex items-center gap-2 cursor-pointer"
        >
          {isExporting === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToWord}
          disabled={!hasContent || isExporting !== null}
          className="flex items-center gap-2 cursor-pointer"
        >
          {isExporting === "word" ? <Loader2 className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
          Export as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
