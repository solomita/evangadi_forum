import { GoogleGenAI } from "@google/genai";
 import { BadRequestError } from "./errors/index.js";


const GEMINI_API_KEY= process.env.GEMINI_API_KEY
const EMBEDDING_MODEL =process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";


const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY})


export const getDocumentEmbedding = async (text)=>{

  const result = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { taskType: "RETRIEVAL_DOCUMENT" },
  });

  const values = result.embeddings?.[0].values ?? result.embeddings?.values;
  if(!Array.isArray(values)|| values.length===0){
    throw new BadRequestError("Invalid embedding output from Gemini API");
  }
  return values;
}