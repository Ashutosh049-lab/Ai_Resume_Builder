import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { experience, education, currentSkills } = await request.json()

    const context = `
Work Experience:
${experience.map((exp: any) => `- ${exp.position} at ${exp.company}: ${exp.description}`).join("\n") || "No experience provided"}

Education:
${education.map((edu: any) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join("\n") || "No education provided"}

Current Skills:
${currentSkills.map((skill: any) => `- ${skill.name} (${skill.category}, ${skill.level})`).join("\n") || "No skills provided"}
    `.trim()

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Based on the following resume information, suggest 8-12 relevant skills that would strengthen this resume. Consider the person's experience and education background.

${context}

Please suggest skills in the following format, categorizing them as technical, soft, or language skills:

Technical Skills (programming languages, tools, software, certifications):
- [Skill Name] (intermediate/advanced/expert)

Soft Skills (leadership, communication, problem-solving, etc.):
- [Skill Name] (intermediate/advanced/expert)

Language Skills (if applicable):
- [Language] (beginner/intermediate/advanced/expert)

Focus on:
1. Skills that align with their experience and education
2. Industry-relevant technical skills
3. In-demand soft skills for their field
4. Skills that would make them more competitive

Suggested Skills:`,
    })

    return NextResponse.json({ suggestions: text.trim() })
  } catch (error) {
    console.error("Error suggesting skills:", error)
    return NextResponse.json({ error: "Failed to suggest skills" }, { status: 500 })
  }
}
