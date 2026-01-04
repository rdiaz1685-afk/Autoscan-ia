
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

// Inicialización con el nuevo estándar de la SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Escaneo de VIN con Gemini 3 Flash.
 * Extrae datos técnicos a partir de una imagen.
 */
export const analyzeVIN = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "Actúa como un experto en registro vehicular global. Identifica el VIN, Marca, Modelo, Año y Color de la imagen. Responde estrictamente en formato JSON." }
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

/**
 * Ficha técnica avanzada con IA.
 */
export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Proporciona una ficha técnica de alto nivel para un ${year} ${make} ${model}. Debe ser información verídica y técnica. Responde en JSON.`,
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

/**
 * Análisis pericial profundo con Gemini 3 Pro.
 * Se usa Thinking Config para mejorar el razonamiento del reporte.
 */
export const generateFinalReport = async (data: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Como perito automotriz senior, genera un reporte detallado: ${JSON.stringify(data)}. 
    Enfócate en: Resumen ejecutivo, Salud mecánica (OBD), Análisis legal y Recomendación de compra. 
    Usa un tono profesional e impecable en Markdown.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

/**
 * Chat interactivo con el Inspector.
 */
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
      systemInstruction: `Eres AutoScan AI, un ingeniero automotriz experto. Estás inspeccionando un ${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}. Guía al usuario para encontrar fallas. Sé técnico, conciso y directo.`
    }
  });
  return response.text;
};

/**
 * Diagnóstico de códigos OBD-II.
 */
export const analyzeOBDCodes = async (codes: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza estos códigos OBD-II: ${codes.join(", ")}. Determina gravedad y causa probable. Responde en formato JSON.`,
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
