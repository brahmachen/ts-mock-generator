import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import prompts from "./prompt";
import jsonPrompts from "./prompt-json";
import { Schema } from "ts-json-schema-generator";
import * as nls from "vscode-nls";

const localize = nls.loadMessageBundle();

// 日志函数封装
function logToFile(
  logPath: string,
  message: string,
  level: "INFO" | "ERROR" = "INFO"
) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = ` ${timestamp} [ ${level} ] ${message} \n `;
    fs.appendFileSync(logPath, logEntry);
  } catch (logError) {
    console.error("Failed to write to log file:", logError);
  }
}

async function generateFakerMockFromSchema(
  context: vscode.ExtensionContext,
  schema: Schema,
  typeName: string,
  filePath: string
) {
  const logDir = context.globalStoragePath;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logPath = path.join(logDir, "deepseek-mock-generator.log");

  try {
    const config = vscode.workspace.getConfiguration("deepseek");
    const apiKey = config.get<string>("apiKey");

    if (!apiKey) {
      vscode.window.showErrorMessage(
        localize(
          "error.apiKeyNotConfigured",
          "DeepSeek API key is not configured. Please set it in the settings."
        )
      );
      return;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize(
          "progress.generatingFakerMock",
          "Generating Faker Mock Code..."
        ),
        cancellable: false,
      },
      async () => {
        const finalPrompt = prompts.userPrompt.replace(
          "{SCHEMA_CONTENT}",
          JSON.stringify(schema, null, 2)
        );

        const apiBase = config.get<string>(
          "apiUrl",
          "https://api.deepseek.com/v1"
        );
        const model = config.get<string>("model", "deepseek-chat");
        const temperature = config.get<number>("temperature", 0.3);

        const openai = new OpenAI({ apiKey, baseURL: apiBase });

        const requestParams = {
          model: model,
          messages: [
            { role: "system", content: prompts.systemPrompt },
            { role: "user", content: finalPrompt },
          ],
          temperature: temperature,
        };

        const response = await openai.chat.completions.create(
          requestParams as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
        );
        let generatedContent = response.choices[0].message.content || "";
        generatedContent = generatedContent.replace(
          /```(?:javascript|js)?\n?|\n?```/g,
          ""
        );

        const originalFileName = path.basename(
          filePath,
          path.extname(filePath)
        );
        const targetPath = path.join(
          path.dirname(filePath),
          `${originalFileName}.${typeName}.mock.js`
        );

        fs.writeFileSync(targetPath, generatedContent);
        logToFile(logPath, `Mock data saved to: ${targetPath}`);
        vscode.window.showInformationMessage(
          localize(
            "info.fakerMockGenerated",
            `Mock data generated successfully ➜ ${path.basename(targetPath)}`
          )
        );
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.stack || error.message
        : JSON.stringify(error);
    logToFile(logPath, `Error occurred: ${errorMessage}`, "ERROR");
    vscode.window.showErrorMessage(
      localize(
        "error.aiServiceFailed",
        `Request to AI service failed. Please check your network connection or API key. Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}

async function generateJsonMockFromSchema(
  context: vscode.ExtensionContext,
  schema: Schema,
  typeName: string,
  filePath: string
) {
  const logDir = context.globalStoragePath;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logPath = path.join(logDir, "deepseek-mock-generator.log");

  try {
    const config = vscode.workspace.getConfiguration("deepseek");
    const apiKey = config.get<string>("apiKey");

    if (!apiKey) {
      vscode.window.showErrorMessage(
        localize(
          "error.apiKeyNotConfigured",
          "DeepSeek API key is not configured. Please set it in the settings."
        )
      );
      return;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize(
          "progress.generatingJsonMock",
          "Generating Mock JSON..."
        ),
        cancellable: false,
      },
      async () => {
        const finalPrompt = jsonPrompts.userPrompt.replace(
          "{SCHEMA_CONTENT}",
          JSON.stringify(schema, null, 2)
        );

        const apiBase = config.get<string>(
          "apiUrl",
          "https://api.deepseek.com/v1"
        );
        const model = config.get<string>("model", "deepseek-chat");
        const temperature = config.get<number>("temperature", 0.3);

        const openai = new OpenAI({ apiKey, baseURL: apiBase });

        const requestParams = {
          model: model,
          messages: [
            { role: "system", content: jsonPrompts.systemPrompt },
            { role: "user", content: finalPrompt },
          ],
          temperature: temperature,
        };

        const response = await openai.chat.completions.create(
          requestParams as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
        );
        const generatedContent = response.choices[0].message.content || "{}";

        const originalFileName = path.basename(
          filePath,
          path.extname(filePath)
        );
        const targetPath = path.join(
          path.dirname(filePath),
          `${originalFileName}.${typeName}.mock.json`
        );

        try {
          const parsedJson = JSON.parse(generatedContent);
          fs.writeFileSync(targetPath, JSON.stringify(parsedJson, null, 2));
        } catch (e) {
          fs.writeFileSync(targetPath, generatedContent);
          logToFile(
            logPath,
            `Failed to parse generated JSON content. Saved as raw string. Error: ${e}`,
            "ERROR"
          );
        }

        logToFile(logPath, `Mock JSON saved to: ${targetPath}`);
        vscode.window.showInformationMessage(
          localize(
            "info.jsonMockGenerated",
            `Mock JSON saved successfully ➜ ${path.basename(targetPath)}`
          )
        );
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.stack || error.message
        : JSON.stringify(error);
    logToFile(logPath, `Error occurred: ${errorMessage}`, "ERROR");
    vscode.window.showErrorMessage(
      localize(
        "error.aiServiceFailed",
        `Request to AI service failed. Please check your network connection or API key. Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
  }
}

export async function generateMockData(
  context: vscode.ExtensionContext,
  uri: vscode.Uri
) {
  const schemaContent = fs.readFileSync(uri.fsPath, "utf-8");
  const schema = JSON.parse(schemaContent);
  const typeName = path.basename(uri.fsPath, ".schema.json");
  await generateFakerMockFromSchema(context, schema, typeName, uri.fsPath);
}

export async function generateMockDataJson(
  context: vscode.ExtensionContext,
  uri: vscode.Uri
) {
  const schemaContent = fs.readFileSync(uri.fsPath, "utf-8");
  const schema = JSON.parse(schemaContent);
  const typeName = path.basename(uri.fsPath, ".schema.json");
  await generateJsonMockFromSchema(context, schema, typeName, uri.fsPath);
}

export { generateFakerMockFromSchema, generateJsonMockFromSchema };
