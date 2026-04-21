import { invokeLLM } from "./_core/llm";
import { JobDescriptionAnalysis, ATSScoreResult } from "@shared/types";

/**
 * Analyze a job description and extract keywords, skills, and requirements
 */
export async function analyzeJobDescription(
  jobDescription: string
): Promise<JobDescriptionAnalysis> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert recruiter and ATS specialist. Analyze job descriptions and extract key information that candidates should include in their resumes.`,
      },
      {
        role: "user",
        content: `Analyze this job description and extract:
1. Top 15 keywords and phrases (ranked by importance)
2. Required technical skills
3. Preferred/nice-to-have skills
4. Key responsibilities
5. Required qualifications

Job Description:
${jobDescription}

Return the analysis in JSON format with these exact fields: keywords (array of {keyword, frequency, importance}), requiredSkills, preferredSkills, responsibilities, qualifications`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "job_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  frequency: { type: "number" },
                  importance: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                },
                required: ["keyword", "frequency", "importance"],
              },
            },
            requiredSkills: {
              type: "array",
              items: { type: "string" },
            },
            preferredSkills: {
              type: "array",
              items: { type: "string" },
            },
            responsibilities: {
              type: "array",
              items: { type: "string" },
            },
            qualifications: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "keywords",
            "requiredSkills",
            "preferredSkills",
            "responsibilities",
            "qualifications",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (!content) throw new Error("No response from LLM");

    const text = typeof content === "string" ? content : "";
    if (!text) throw new Error("Empty response from LLM");
    
    const parsed = JSON.parse(text);
    return parsed as JobDescriptionAnalysis;
  } catch (error) {
    console.error("Failed to parse job description analysis:", error);
    throw new Error("Failed to analyze job description");
  }
}

/**
 * Rewrite a resume bullet point to include specific keywords
 */
export async function rewriteBulletPoint(
  bulletPoint: string,
  keywords: string[],
  context: string = ""
): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer specializing in ATS optimization. Your task is to rewrite resume bullet points to naturally incorporate relevant keywords while maintaining authenticity and impact.`,
      },
      {
        role: "user",
        content: `Rewrite this resume bullet point to naturally incorporate the following keywords: ${keywords.join(", ")}

Original bullet point: "${bulletPoint}"

${context ? `Context: ${context}` : ""}

Requirements:
- Keep the bullet point concise (one line, under 100 characters)
- Naturally incorporate as many keywords as possible
- Maintain action-oriented language with strong verbs
- Ensure it sounds authentic and professional
- Start with a strong action verb

Return only the rewritten bullet point, no explanation.`,
      },
    ],
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("Failed to rewrite bullet point");

  const text = typeof content === "string" ? content : "";
  return text.trim();
}

/**
 * Calculate ATS score by comparing resume content with job description keywords
 */
export async function calculateATSScore(
  resumeContent: string,
  jobKeywords: string[]
): Promise<ATSScoreResult> {
  const resumeText = resumeContent.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  // Check which keywords are present in the resume
  for (const keyword of jobKeywords) {
    const keywordLower = keyword.toLowerCase();
    if (resumeText.includes(keywordLower)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  // Calculate score as percentage of matched keywords
  const score = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

  // Generate suggestions for missing keywords
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    suggestions.push(
      `Consider adding these important keywords: ${topMissing.join(", ")}`
    );
  }

  // Add formatting suggestions
  if (!resumeText.includes("bullet") && resumeText.split("\n").length < 10) {
    suggestions.push(
      "Use bullet points to highlight achievements and make content scannable"
    );
  }

  if (resumeText.length < 200) {
    suggestions.push("Add more detail to your experience descriptions");
  }

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions,
    timestamp: new Date(),
  };
}

/**
 * Generate a cover letter based on resume and job description
 */
export async function generateCoverLetter(
  resumeData: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer. Write compelling, personalized cover letters that highlight relevant experience and demonstrate genuine interest in the position.`,
      },
      {
        role: "user",
        content: `Write a professional cover letter for the following:

Company: ${companyName}

Job Description:
${jobDescription}

Candidate Resume Data:
${resumeData}

Requirements:
- 3-4 paragraphs
- Professional tone
- Highlight specific achievements from resume that match job requirements
- Show enthusiasm for the role and company
- Include a call to action
- Use proper business letter format`,
      },
    ],
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("Failed to generate cover letter");

  const text = typeof content === "string" ? content : "";
  return text.trim();
}
