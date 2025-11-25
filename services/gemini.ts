import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InvisibleEntity } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const entitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Un nombre técnico o místico para la anomalía detectada." },
    description: { type: Type.STRING, description: "Una descripción física precisa de la entidad y su ubicación exacta en la imagen (ej: 'flotando sobre la mesa', 'emergiendo de la sombra en la esquina')." },
    visualStyle: { type: Type.STRING, description: "Instrucciones visuales concretas (materiales, iluminación, colores)." },
    meaning: { type: Type.STRING, description: "La función o propósito de esta entidad en este lugar." },
    estimatedAge: { type: Type.STRING, description: "Antigüedad estimada de la anomalía." },
    rarity: { 
      type: Type.STRING, 
      enum: ['Común', 'Raro', 'Legendario', 'Artefacto'],
      description: "Clasificación de rareza."
    }
  },
  required: ["title", "description", "visualStyle", "meaning", "estimatedAge", "rarity"],
};

export const DEFAULT_PROMPT = `Actúa como un escáner de realidad aumentada avanzado. Tu objetivo es detectar "capas ocultas" sobre la realidad física.
1. ANALIZA la imagen proporcionada: Identifica la geometría de la habitación, las superficies planas (mesas, suelos), la iluminación actual y los objetos visibles.
2. GENERA una 'Entidad Invisible' que se integre FÍSICAMENTE en este entorno.
   - Si hay una mesa, la entidad debe estar apoyada en ella.
   - Si hay una esquina oscura, la entidad debe estar escondida allí.
   - La iluminación de la entidad debe coincidir con la de la foto.
3. NO inventes un escenario de fantasía aleatorio. La descripción debe sonar creíble y estar ANCLADA a lo que ves en la cámara.
Responde ÚNICAMENTE en JSON válido según el esquema.`;

export const scanForInvisibleEntity = async (base64Image: string, customPrompt: string): Promise<InvisibleEntity> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Clean base64 string
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: customPrompt || DEFAULT_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: entitySchema,
        temperature: 0.6,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No hay respuesta del mundo invisible.");

    return JSON.parse(text) as InvisibleEntity;

  } catch (error) {
    console.error("Failed to scan invisible entity:", error);
    throw error;
  }
};

export const generateEntityVisualization = async (
  entity: InvisibleEntity, 
  imageSize: '1K' | '2K' | '4K',
  negativePrompt: string
): Promise<string[]> => {
  try {
    // Usar "Nano Banana" (gemini-2.5-flash-image)
    const model = 'gemini-2.5-flash-image';
    
    // Prompt optimizado para REALISMO INTEGRADO con soporte para Negativo
    const prompt = `Fotografía macro realista o plano medio cinematográfico.
    Objeto: ${entity.description}.
    Estilo y Materiales: ${entity.visualStyle}.
    CONTEXTO: El objeto debe parecer real, tangible y físico.
    Iluminación: Coherente con una fotografía real (sombras, reflejos, texturas).
    IMPORTANTE - EXCLUSIONES (NEGATIVE PROMPT): ${negativePrompt || "Ninguno"}.
    NO generes: texto, marcos, dibujos animados, arte conceptual plano, ni nada listado en las exclusiones. Debe parecer una foto real de un fenómeno extraño.`;

    // Función auxiliar para generar una sola imagen
    const generateOne = async () => {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    };

    // Generar 4 imágenes en paralelo
    const promises = [generateOne(), generateOne(), generateOne(), generateOne()];
    const results = await Promise.all(promises);
    
    // Filtrar nulos
    return results.filter((url): url is string => url !== null);

  } catch (error) {
    console.error("Failed to visualize entity:", error);
    return [];
  }
};