import { GoogleGenAI } from "@google/genai";
import { Grade, Subject } from "../types";

export const askEduGenie = async (
  grade: Grade,
  subject: Subject,
  question: string,
  history: { role: 'user' | 'assistant', content: string }[]
) => {
  // Access the API key injected by Vite's define config at build time
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === '') {
    console.error("Environment check: API_KEY is missing from process.env");
    throw new Error("API Key not found. Please ensure the API_KEY environment variable is set in your Vercel project settings and redeploy.");
  }

  // Create a new instance right before use to ensure the most up-to-date key is used
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are EduGenie, a world-class educational AI tutor.
Current Student Context:
- Grade Level: ${grade}
- Current Subject: ${subject}

Instructions:
1. Provide accurate, encouraging, and clear explanations.
2. Adjust your language and complexity to fit a ${grade} student.
3. If the subject is ${subject}, use specific terminology relevant to that field.
4. IMPORTANT: DO NOT use any markdown formatting symbols. No stars (*), no hashtags (#), no dashes (-) for lists, and no bold or italic markers.
5. Provide the response in PLAIN TEXT only. Use standard sentences and paragraphs.
6. Keep the answer extremely concise and to the point.
7. Word limit: The response MUST be between 50 and 100 words.
8. Do not use bullet points. Use simple, flowing text.
9. For younger students (Elementary), use simple language. For older students, be more technical but still follow the plain text rule.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: h.content }] 
        })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. This might be a temporary safety filter hit.");
    }
    // Final cleanup in case the model ignores instructions
    return text.replace(/[*#_~`]/g, '').trim();
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    
    // Improved error messaging for the UI
    if (error.message?.includes('403')) {
      throw new Error("Invalid API Key or permission denied. Please verify your Gemini API key in Vercel.");
    }
    if (error.message?.includes('429')) {
      throw new Error("Rate limit exceeded. Please wait a minute and try again.");
    }
    
    throw new Error(error.message || "Failed to communicate with the educational AI. Please try again later.");
  }
};