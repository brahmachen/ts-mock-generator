import OpenAI from "openai";
import { Schema } from "ts-json-schema-generator";
import prompts from "../prompt";
import jsonPrompts from "../prompt-json";

export interface AiOptions {
  apiKey: string;
  apiUrl?: string;
  model?: string;
  temperature?: number;
}

export async function generateFakerCode(
  schema: Schema,
  options: AiOptions
): Promise<string> {
  const {
    apiKey,
    apiUrl = "https://api.deepseek.com/v1",
    model = "deepseek-chat",
    temperature = 0.3,
  } = options;

  const openai = new OpenAI({ apiKey, baseURL: apiUrl });

  const finalPrompt = prompts.userPrompt.replace(
    "{SCHEMA_CONTENT}",
    JSON.stringify(schema, null, 2)
  );

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: prompts.systemPrompt },
      { role: "user", content: finalPrompt },
    ],
    temperature: temperature,
  });

  let content = response.choices[0].message.content || "";
  // Remove markdown code blocks if present
  content = content.replace(/```(?:javascript|js)?\n?|\n?```/g, "");
  return content;
}

export async function generateJsonData(
  schema: Schema,
  options: AiOptions
): Promise<string> {
  const {
    apiKey,
    apiUrl = "https://api.deepseek.com/v1",
    model = "deepseek-chat",
    temperature = 0.3,
  } = options;

  const openai = new OpenAI({ apiKey, baseURL: apiUrl });

  const finalPrompt = jsonPrompts.userPrompt.replace(
    "{SCHEMA_CONTENT}",
    JSON.stringify(schema, null, 2)
  );

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: jsonPrompts.systemPrompt },
      { role: "user", content: finalPrompt },
    ],
    temperature: temperature,
  });

  const content = response.choices[0].message.content || "";
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch (e) {
    console.warn("Failed to parse generated JSON content. Returning raw string.");
    return content;
  }
}
