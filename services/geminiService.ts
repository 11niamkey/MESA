
import { GoogleGenAI, Type } from "@google/genai";
import { AiMenuResponse } from "../types";

export const generateMenuFromIngredients = async (
  ingredients: string,
  style: string
): Promise<AiMenuResponse | null> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Sei un esperto chef italiano e copywriter di menu.
      Ho questi ingredienti: "${ingredients}".
      Voglio creare un piatto nello stile: "${style}".
      
      Genera un nome attraente per il piatto, una descrizione appetitosa (massimo 150 caratteri), 
      un prezzo suggerito in Euro (basato sugli ingredienti) e alcuni tag pertinenti.
      Rispondi ESCLUSIVAMENTE con un oggetto JSON.
    `;

    // Updated model to 'gemini-3-flash-preview' per guidelines for Basic Text Tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["dishName", "description", "suggestedPrice", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as AiMenuResponse;
  } catch (error) {
    console.error("Error generating menu:", error);
    return null;
  }
};
