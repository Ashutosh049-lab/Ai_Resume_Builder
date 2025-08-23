import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    // Generate HTML content for the resume
    const htmlContent = generateResumeHTML(resumeData, template || "modern")

    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    })

    await browser.close()

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName || "resume"}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateResumeHTML(resumeData: any, template: string) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "background-color: #fef3c7; color: #92400e;"
      case "intermediate":
        return "background-color: #dbeafe; color: #1e40af;"
      case "advanced":
        return "background-color: #d1fae5; color: #065f46;"
      case "expert":
        return "background-color: #e9d5ff; color: #6b21a8;"
      default:
        return "background-color: #f3f4f6; color: #374151;"
    }
  }

  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; }
      .container { max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
      h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; padding-bottom: 4px; }
      h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
      p { margin-bottom: 8px; }
      .contact-info { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; font-size: 14px; }
      .contact-item { display: flex; align-items: center; gap: 4px; }
      .section { margin-bottom: 24px; }
      .experience-item, .education-item { margin-bottom: 16px; }
      .date-range { font-size: 14px; color: #6b7280; }
      .skills-category { margin-bottom: 12px; }
      .skill-badge { display: inline-block; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; }
      .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
    </style>
  `

  // Template-specific styles
  let templateStyles = ""
  const headerClass = ""
  const sectionHeaderClass = ""

  switch (template) {
    case "modern":
      templateStyles = `
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 24px; margin-bottom: 24px; }
        .section h2 { color: #3b82f6; border-bottom: 1px solid #dbeafe; }
        .contact-item svg { color: #3b82f6; }
        .company-name { color: #3b82f6; font-weight: 500; }
      `
      break
    case "classic":
      templateStyles = `
        .header { text-align: center; border-bottom: 2px solid #374151; padding-bottom: 24px; margin-bottom: 24px; }
        .section h2 { color: #374151; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #9ca3af; }
        .company-name { font-style: italic; }
      `
      break
    case "creative":
      templateStyles = `
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 32px; border-radius: 16px; margin-bottom: 24px; }
        .section h2 { color: #8b5cf6; }
        .company-name { color: #8b5cf6; font-weight: 500; }
      `
      break
    case "minimal":
      templateStyles = `
        .header { margin-bottom: 48px; }
        .header h1 { font-size: 32px; font-weight: 300; letter-spacing: 2px; }
        .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 500; }
        .contact-info { flex-direction: column; gap: 4px; }
      `
      break
    case "executive":
      templateStyles = `
        .header { background: linear-gradient(135deg, #065f46, #0f766e); color: white; padding: 32px; margin-bottom: 32px; }
        .section h2 { color: #065f46; border-bottom: 2px solid #d1fae5; }
        .company-name { color: #065f46; font-weight: 600; }
      `
      break
    case "tech":
      templateStyles = `
        .header { background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 32px; margin-bottom: 32px; }
        .section h2 { color: #06b6d4; }
        .company-name { color: #06b6d4; }
        body { font-family: 'Courier New', monospace; }
      `
      break
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Resume - ${resumeData.personalInfo.fullName}</title>
      ${baseStyles}
      <style>${templateStyles}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>${resumeData.personalInfo.fullName || "Your Name"}</h1>
          <div class="contact-info">
            ${resumeData.personalInfo.email ? `<div class="contact-item">📧 ${resumeData.personalInfo.email}</div>` : ""}
            ${resumeData.personalInfo.phone ? `<div class="contact-item">📞 ${resumeData.personalInfo.phone}</div>` : ""}
            ${resumeData.personalInfo.location ? `<div class="contact-item">📍 ${resumeData.personalInfo.location}</div>` : ""}
            ${resumeData.personalInfo.linkedIn ? `<div class="contact-item">💼 ${resumeData.personalInfo.linkedIn}</div>` : ""}
            ${resumeData.personalInfo.website ? `<div class="contact-item">🌐 ${resumeData.personalInfo.website}</div>` : ""}
          </div>
        </div>

        <!-- Professional Summary -->
        ${
          resumeData.personalInfo.summary
            ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${resumeData.personalInfo.summary}</p>
          </div>
        `
            : ""
        }

        <!-- Experience -->
        ${
          resumeData.experience.length > 0
            ? `
          <div class="section">
            <h2>Work Experience</h2>
            ${resumeData.experience
              .map(
                (exp: any) => `
              <div class="experience-item">
                <div class="flex-between">
                  <div>
                    <h3>${exp.position}</h3>
                    <p class="company-name">${exp.company}</p>
                  </div>
                  <div class="date-range">
                    ${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                ${exp.description ? `<p style="margin-top: 8px;">${exp.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        <!-- Education -->
        ${
          resumeData.education.length > 0
            ? `
          <div class="section">
            <h2>Education</h2>
            ${resumeData.education
              .map(
                (edu: any) => `
              <div class="education-item">
                <div class="flex-between">
                  <div>
                    <h3>${edu.degree} ${edu.field ? `in ${edu.field}` : ""}</h3>
                    <p class="company-name">${edu.institution}</p>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
                  </div>
                  <div class="date-range">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }

        <!-- Skills -->
        ${
          resumeData.skills.length > 0
            ? `
          <div class="section">
            <h2>Skills</h2>
            ${["technical", "soft", "language"]
              .map((category) => {
                const categorySkills = resumeData.skills.filter((skill: any) => skill.category === category)
                if (categorySkills.length === 0) return ""

                return `
                <div class="skills-category">
                  <h3>${category === "technical" ? "Technical Skills" : category === "soft" ? "Soft Skills" : "Languages"}</h3>
                  <div>
                    ${categorySkills
                      .map(
                        (skill: any) => `
                      <span class="skill-badge" style="${getLevelColor(skill.level)}">
                        ${skill.name} (${skill.level})
                      </span>
                    `,
                      )
                      .join("")}
                  </div>
                </div>
              `
              })
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `
}
