import { GoogleGenAI, Content } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview as requested for higher quality reasoning
const MODEL_NAME = "gemini-3-pro-preview";

export const sendMessageToGemini = async (
  history: Message[],
  userMessage: string
): Promise<string> => {
  try {
    // Transform history to GoogleGenAI Content format
    const contents: Content[] = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Add the current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text || "得，我这网络卡了，脑子转不过来了，您稍等会儿再试？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "哎哟，我这破服务器又罢工了。看来是想让我休息会儿。您别急，等会儿再来唠？";
  }
};