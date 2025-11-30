import { GoogleGenAI, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, Role } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Helper to convert internal Message type to Gemini Content type
const convertHistoryToContent = (messages: Message[]): Content[] => {
  return messages.map((msg) => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    // Construct the chat history for the API
    // We exclude the very last user message from 'history' array passed here 
    // because the API expects history + current message separately in some contexts,
    // but the stateful Chat API simplifies this.
    // However, for stateless request or creating a new chat object:
    
    const formattedHistory = convertHistoryToContent(history);

    const chat = ai.chats.create({
      model: modelName,
      history: formattedHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Good balance for creative but grounded output
      },
    });

    const result = await chat.sendMessage({
        message: newMessage
    });

    return result.text || "Thinking...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
