
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeVIN = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "Extract VIN and basic info. Return JSON." }
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
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Genera una ficha técnica detallada para un ${year} ${make} ${model}. Incluye motor, caballos de fuerza, torque, transmisión, tipo de tracción y 2 datos curiosos o problemas comunes de este modelo. Retorna JSON.`,
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

export const chatInspector = async (history: Message[], userInput: string, vehicleInfo: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: `Eres AutoScan AI, un experto en inspección. Vehículo: ${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}. Guía al usuario de forma profesional y técnica.`
    }
  });
  return response.text;
};

export const analyzeOBDCodes = async (codes: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza códigos OBD-II: ${codes.join(", ")}. Retorna JSON con severidad y causas.`,
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

export const generateFinalReport = async (data: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Genera reporte final exhaustivo: ${JSON.stringify(data)}. Formato Markdown.`,
  });
  return response.text;
};
