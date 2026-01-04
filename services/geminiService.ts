
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Analiza la imagen del VIN para extraer datos básicos.
 * Usa gemini-3-flash-preview para balancear velocidad y precisión.
 */
export const analyzeVIN = async (imageBase64: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: "Actúa como un experto en identificación vehicular. Extrae el VIN (Vehicle Identification Number), Marca, Modelo, Año y Color predominante de la imagen. Responde estrictamente en JSON." }
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
 * Obtiene especificaciones técnicas avanzadas del modelo.
 */
export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Proporciona una ficha técnica premium para un ${year} ${make} ${model}. Incluye detalles técnicos reales y específicos de ese año. Responde en JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          engine: { type: Type.STRING, description: "Tipo de motor y cilindrada" },
          horsepower: { type: Type.STRING, description: "Caballos de fuerza" },
          torque: { type: Type.STRING, description: "Torque máximo" },
          transmission: { type: Type.STRING, description: "Tipo de caja de cambios" },
          driveType: { type: Type.STRING, description: "Tracción (FWD, RWD, AWD, 4WD)" },
          fuelEconomy: { type: Type.STRING, description: "Rendimiento estimado" },
          curiosities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Datos históricos o fallas comunes conocidas" }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

/**
 * Chat interactivo con el inspector.
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
      systemInstruction: `Eres AutoScan AI, un ingeniero automotriz senior. Estás inspeccionando un ${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}. Tu objetivo es guiar al usuario para detectar fallas mecánicas, estéticas o irregularidades legales (tenencias, facturas). Sé técnico, conciso y profesional. Si el usuario menciona daños, explícale cómo afectan el valor comercial.`
    }
  });
  return response.text;
};

/**
 * Análisis de códigos de error OBD-II.
 */
export const analyzeOBDCodes = async (codes: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza estos códigos de falla OBD-II y determina la causa raíz y urgencia: ${codes.join(", ")}. Responde en JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            title: { type: Type.STRING },
            severity: { type: Type.STRING, description: "High, Medium, Low" },
            cause: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

/**
 * Generación de reporte final premium.
 * Usa gemini-3-pro-preview para un análisis profundo y redacción impecable.
 */
export const generateFinalReport = async (data: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Actúa como un perito automotriz certificado. Genera un reporte de inspección exhaustivo basado en estos datos: ${JSON.stringify(data)}.
    El reporte debe incluir:
    1. Resumen Ejecutivo (Veredicto de compra).
    2. Análisis de Identidad y Ficha Técnica.
    3. Evaluación de Salud Mecánica (OBD-II).
    4. Diagnóstico de Documentación Legal.
    5. Estimación de Valor Comercial (Sugerencia de precio).
    Usa formato Markdown profesional.`,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};
