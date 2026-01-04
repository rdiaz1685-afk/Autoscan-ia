
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const getApiKey = () => process.env.API_KEY || "";

export const analyzeVIN = async (imageBase64: string, mimeType: string = "image/jpeg") => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mimeType } },
          { text: "Analiza esta imagen de un vehículo o su placa de identificación. Extrae: VIN, Marca, Modelo, Año. Responde en JSON puro." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vin: { type: Type.STRING, description: "Número de identificación vehicular" },
          make: { type: Type.STRING, description: "Marca del auto" },
          model: { type: Type.STRING, description: "Submarca o modelo" },
          year: { type: Type.NUMBER, description: "Año de fabricación" },
          color: { type: Type.STRING, description: "Color predominante" }
        },
        required: ["make", "model"] // Solo pedimos Marca y Modelo como obligatorios para mayor flexibilidad
      }
    }
  });
  
  if (!response.text) throw new Error("EMPTY_RESPONSE");
  return JSON.parse(response.text);
};

export const getVehicleSpecs = async (make: string, model: string, year: number) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Ficha técnica para ${year} ${make} ${model} en JSON.`,
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
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Genera reporte pericial en Markdown: ${JSON.stringify(data)}`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text;
};

export const chatInspector = async (history: Message[], userInput: string, vehicleInfo: any) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: `Asistente técnico para ${vehicleInfo?.make}.`
    }
  });
  return response.text;
};

export const analyzeOBDCodes = async (codes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analiza códigos OBD: ${codes.join(", ")}. JSON.`,
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
