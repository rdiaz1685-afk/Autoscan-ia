
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

// Inicialización con el nuevo estándar de la SDK
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. Please add it to Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

/**
 * Escaneo de VIN con Gemini 3 Flash.
 * @param imageBase64 - Datos de la imagen en base64
 * @param mimeType - Tipo de imagen (image/jpeg, image/png, etc.)
 */
export const analyzeVIN = async (imageBase64: string, mimeType: string = "image/jpeg") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: imageBase64, mimeType: mimeType } },
            { text: "Eres un experto en identificación vehicular. Analiza esta imagen (puede ser un código de barras, una placa de metal o una tarjeta de circulación). Encuentra el VIN (Número de Identificación Vehicular), Marca, Modelo, Año y Color. Si es una tarjeta de circulación, extrae los datos oficiales. Responde estrictamente con un JSON válido." }
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

    const text = response.text;
    if (!text) throw new Error("La IA no devolvió contenido.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error en analyzeVIN:", error);
    throw error;
  }
};

/**
 * Ficha técnica avanzada con IA.
 */
export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const ai = getAI();
  try {
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
  } catch (error) {
    console.error("Error en getVehicleSpecs:", error);
    return {};
  }
};

/**
 * Análisis pericial profundo con Gemini 3 Pro.
 */
export const generateFinalReport = async (data: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Como perito automotriz senior, genera un reporte detallado del siguiente estado de evaluación: ${JSON.stringify(data)}. 
    Incluye: Resumen ejecutivo, Salud mecánica (OBD), Análisis legal y Recomendación comercial. 
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
  const ai = getAI();
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
  const ai = getAI();
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
