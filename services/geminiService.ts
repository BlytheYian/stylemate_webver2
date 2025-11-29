import { GoogleGenAI, Type } from "@google/genai";

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the data:image/jpeg;base64, part
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};


export const generateClothingTags = async (base64Image: string, mimeType: string): Promise<{ category: string; color: string; style_tags: string[]; estimatedPrice: number; }> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: "您是一位時尚專家AI。請分析這張衣物圖片。識別它的類別（例如：T恤、牛仔褲、連身裙、外套），主要顏色，並提供3-5個相關的風格標籤（例如：Y2K、Gorpcore、街頭風、極簡風、復古風、波西米亞風、簡約風），並預估一個合理的二手市場價格（以新台幣 TWD 為單位，僅提供數字）。請僅用符合所提供 schema 的 JSON 物件進行回覆。使用中文。",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING, description: "The category of the clothing item." },
                        color: { type: Type.STRING, description: "The primary color of the item." },
                        style_tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of 3-5 style tags."
                        },
                        estimatedPrice: { type: Type.NUMBER, description: "The estimated secondhand price in TWD." }
                    },
                    required: ["category", "color", "style_tags", "estimatedPrice"],
                },
            },
        });

        // FIX: The response object has a `.text` property that directly provides the string output.
        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);
        return parsedJson;

    } catch (error) {
        console.error("Error generating clothing tags:", error);
        const errorMessage = error instanceof Error ? error.message : "AI圖片分析失敗，請重試。";
        throw new Error(errorMessage);
    }
};
