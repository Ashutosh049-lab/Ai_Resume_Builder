import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { description, position, company, type = "experience" } = await request.json()

    if (!description || !position) {
      return NextResponse.json({ error: "Description and position are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Enhance the following ${type} description for a resume. The position is "${position}"${company ? ` at ${company}` : ""}.

Original description: "${description}"

Please rewrite this description to be more professional, impactful, and ATS-friendly. Follow these guidelines:
1. Use strong action verbs to start each bullet point
2. Include specific achievements and metrics where possible
3. Focus on results and impact rather than just responsibilities
4. Use professional language appropriate for a resume
5. Keep it concise but comprehensive
6. Make it 2-4 bullet points or a well-structured paragraph

Enhanced description:`,
    })

    return NextResponse.json({ enhancedDescription: text.trim() })
  } catch (error) {
    console.error("Error enhancing description:", error)
    return NextResponse.json({ error: "Failed to enhance description" }, { status: 500 })
  }
}
