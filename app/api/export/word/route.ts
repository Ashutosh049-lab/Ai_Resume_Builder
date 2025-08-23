import { type NextRequest, NextResponse } from "next/server"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    const doc = generateWordDocument(resumeData, template || "modern")
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName || "resume"}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating Word document:", error)
    return NextResponse.json({ error: "Failed to generate Word document" }, { status: 500 })
  }
}

function generateWordDocument(resumeData: any, template: string) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const children: any[] = []

  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.personalInfo.fullName || "Your Name",
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
    }),
  )

  // Contact Information
  const contactInfo = []
  if (resumeData.personalInfo.email) contactInfo.push(`📧 ${resumeData.personalInfo.email}`)
  if (resumeData.personalInfo.phone) contactInfo.push(`📞 ${resumeData.personalInfo.phone}`)
  if (resumeData.personalInfo.location) contactInfo.push(`📍 ${resumeData.personalInfo.location}`)
  if (resumeData.personalInfo.linkedIn) contactInfo.push(`💼 ${resumeData.personalInfo.linkedIn}`)
  if (resumeData.personalInfo.website) contactInfo.push(`🌐 ${resumeData.personalInfo.website}`)

  if (contactInfo.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(" | "),
            size: 20,
          }),
        ],
        alignment: template === "classic" ? AlignmentType.CENTER : AlignmentType.LEFT,
      }),
    )
  }

  children.push(new Paragraph({ text: "" })) // Empty line

  // Professional Summary
  if (resumeData.personalInfo.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFESSIONAL SUMMARY",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "3B82F6",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.personalInfo.summary,
            size: 22,
          }),
        ],
      }),
    )

    children.push(new Paragraph({ text: "" })) // Empty line
  }

  // Work Experience
  if (resumeData.experience.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "WORK EXPERIENCE",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "3B82F6",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    )

    resumeData.experience.forEach((exp: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
            }),
          ],
        }),
      )

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company} | ${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}`,
              size: 20,
              italics: true,
            }),
          ],
        }),
      )

      if (exp.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
              }),
            ],
          }),
        )
      }

      children.push(new Paragraph({ text: "" })) // Empty line
    })
  }

  // Education
  if (resumeData.education.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EDUCATION",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "3B82F6",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    )

    resumeData.education.forEach((edu: any) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} ${edu.field ? `in ${edu.field}` : ""}`,
              bold: true,
              size: 22,
            }),
          ],
        }),
      )

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution} | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
              size: 20,
              italics: true,
            }),
          ],
        }),
      )

      children.push(new Paragraph({ text: "" })) // Empty line
    })
  }

  // Skills
  if (resumeData.skills.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SKILLS",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "3B82F6",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    )

    const categories = ["technical", "soft", "language"]
    categories.forEach((category) => {
      const categorySkills = resumeData.skills.filter((skill: any) => skill.category === category)
      if (categorySkills.length === 0) return

      const categoryName =
        category === "technical" ? "Technical Skills" : category === "soft" ? "Soft Skills" : "Languages"

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: categoryName,
              bold: true,
              size: 20,
            }),
          ],
        }),
      )

      const skillsText = categorySkills.map((skill: any) => `${skill.name} (${skill.level})`).join(", ")
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: skillsText,
              size: 20,
            }),
          ],
        }),
      )

      children.push(new Paragraph({ text: "" })) // Empty line
    })
  }

  return new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  })
}
