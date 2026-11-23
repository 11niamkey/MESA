import { AiMenuResponse } from "../types";

export const generateMenuFromIngredients = async (
  ingredients: string,
  style: string
): Promise<AiMenuResponse | null> => {
  try {
    const response = await fetch("/api/gemini/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients, style }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as AiMenuResponse;
  } catch (error) {
    console.error("Error generating menu:", error);
    return null;
  }
};
