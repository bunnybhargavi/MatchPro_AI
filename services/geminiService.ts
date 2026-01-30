
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export interface ResumeInput {
  text?: string;
  file?: {
    data: string; // base64
    mimeType: string;
  };
}

export const analyzeResume = async (resume: ResumeInput, jobDescription: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const promptText = `
    Analyze the provided Resume and Job Description.
    1. Extract technical and soft skills from both.
    2. Calculate a Match Score (0-100) based on how well the Resume matches the Job Description requirements.
    3. Identify Matched Skills (present in both).
    4. Identify Missing Skills (required in JD but missing in Resume).
    5. Provide specific, actionable learning recommendations for the missing skills.
    6. Provide a short summary of the fit.

    JOB DESCRIPTION:
    ${jobDescription}
  `;

  const contents: any[] = [];
  
  // Build the parts for the resume
  if (resume.file) {
    contents.push({
      inlineData: {
        data: resume.file.data,
        mimeType: resume.file.mimeType
      }
    });
  }
  
  if (resume.text) {
    contents.push({ text: `RESUME TEXT: ${resume.text}` });
  }

  // Add the prompt
  contents.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.NUMBER, description: "Match percentage between 0 and 100" },
          matchedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["technical", "soft", "tool"] }
              },
              required: ["name", "category"]
            }
          },
          missingSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["technical", "soft", "tool"] }
              },
              required: ["name", "category"]
            }
          },
          skillGapScore: { type: Type.NUMBER, description: "Percentage of required JD skills that are missing" },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["matchScore", "matchedSkills", "missingSkills", "skillGapScore", "recommendations", "summary"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze inputs. Please ensure your file is clear and try again.");
  }
};
