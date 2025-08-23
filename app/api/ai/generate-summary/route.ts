import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { personalInfo, experience, education, skills } = await request.json()

    const context = `
Personal Information:
- Name: ${personalInfo.fullName || "Not provided"}
- Email: ${personalInfo.email || "Not provided"}
- Location: ${personalInfo.location || "Not provided"}

Work Experience:
${experience.map((exp: any) => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? "Present" : exp.endDate})`).join("\n") || "No experience provided"}

Education:
${education.map((edu: any) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join("\n") || "No education provided"}

Skills:
${skills.map((skill: any) => `- ${skill.name} (${skill.level})`).join("\n") || "No skills provided"}
    `.trim()

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Based on the following resume information, write a compelling professional summary that is 2-3 sentences long. The summary should highlight key achievements, skills, and career goals in a professional tone suitable for a resume.

${context}

Write a professional summary that:
1. Starts with the person's professional identity or years of experience
2. Highlights 2-3 key skills or achievements
3. Mentions career goals or value proposition
4. Is concise and impactful (2-3 sentences maximum)
5. Uses action-oriented language

Professional Summary:`,
    })

    return NextResponse.json({ summary: text.trim() })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
