
import { GoogleGenAI } from "@google/genai";
import { Grade, Subject } from "../types";

export const askEduGenie = async (
  grade: Grade,
  subject: Subject,
  question: string,
  history: { role: 'user' | 'assistant', content: string }[]
) => {
  // The API key is injected by Vite's define config during build
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are EduGenie, a world-class educational AI tutor.
Current Student Context:
- Grade Level: ${grade}
- Current Subject: ${subject}

Instructions:
1. Provide accurate, encouraging, and clear explanations.
2. Adjust your language, complexity, and examples to fit a ${grade} student.
3. If the subject is ${subject}, use specific terminology and relevant academic standards.
4. Keep answers concise but thorough. Use formatting like bullet points or bold text to improve readability.
5. If the user asks something outside the scope of ${subject}, gently steer them back or explain the connection if one exists.
6. For younger students (Elementary), use simple analogies. For older students (College/Postgrad), be academically rigorous.`;

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
      throw new Error("Empty response from AI");
    }
    return text;
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    throw new Error(error.message || "Failed to communicate with the educational AI.");
  }
};
