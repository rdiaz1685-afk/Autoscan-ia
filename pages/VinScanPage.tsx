
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

/**
 * Función auxiliar para obtener una instancia fresca de la IA.
 * Esto asegura que siempre use la API_KEY disponible en process.env.
 */
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeVIN = async (imageBase64: string, mimeType: string = "image/jpeg") => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mimeType } },
          { text: "Analiza el VIN y datos del vehículo en esta imagen. Responde estrictamente en JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vin: { type: Type.STRING },
          make: { type: Type.STRING },
          model: { type: Type.STRING },
          year: { type: Type.NUMBER },
          color: { type: Type.STRING }
        },
        required: ["vin", "make", "model", "year"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Ficha técnica detallada para ${year} ${make} ${model} en JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          engine: { type: Type.STRING },
          horsepower: { type: Type.STRING },
          torque: { type: Type.STRING },
          transmission: { type: Type.STRING },
          driveType: { type: Type.STRING },
          fuelEconomy: { type: Type.STRING },
          curiosities: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateFinalReport = async (data: any) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Genera un reporte pericial automotriz en Markdown para: ${JSON.stringify(data)}`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

export const chatInspector = async (history: Message[], userInput: string, vehicleInfo: any) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: `Eres AutoScan AI. Estás inspeccionando un ${vehicleInfo?.year} ${vehicleInfo?.make}.`
    }
  });
  return response.text;
};

export const analyzeOBDCodes = async (codes: string[]) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza códigos OBD: ${codes.join(",")}. Responde en JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            title: { type: Type.STRING },
            severity: { type: Type.STRING },
            cause: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};
