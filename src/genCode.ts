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

// 通用的 AI 内容生成和文件写入函数
async function generateAndWriteAiContent(
  context: vscode.ExtensionContext,
  options: {
    schema: Schema;
    typeName: string;
    filePath: string;
    progressTitle: string;
    prompts: { systemPrompt: string; userPrompt: string };
    fileSuffix: string;
    processContent: (content: string) => string;
  }
) {
  const logDir = context.globalStoragePath;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logPath = path.join(logDir, "ts-mock-generator.log");

  try {
    const config = vscode.workspace.getConfiguration("ts-mock-generator");
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

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: options.progressTitle,
        cancellable: false,
      },
      async () => {
        const finalPrompt = options.prompts.userPrompt.replace(
          "{SCHEMA_CONTENT}",
          JSON.stringify(options.schema, null, 2)
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
            { role: "system", content: options.prompts.systemPrompt },
            { role: "user", content: finalPrompt },
          ],
          temperature: temperature,
        };

        const response = await openai.chat.completions.create(
          requestParams as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
        );
        const rawContent = response.choices[0].message.content || "";
        const processedContent = options.processContent(rawContent);

        const originalFileName = path.basename(
          options.filePath,
          path.extname(options.filePath)
        );
        const targetPath = path.join(
          path.dirname(options.filePath),
          `${originalFileName}.${options.typeName}${options.fileSuffix}`
        );

        fs.writeFileSync(targetPath, processedContent);
        logToFile(logPath, `Mock data saved to: ${targetPath}`);
        vscode.window.showInformationMessage(
          localize(
            "info.mockGenerated",
            `Mock data generated successfully ➜ ${path.basename(targetPath)}`
          )
        );
      }
    );
  } catch (error) {
    let userFacingMessage: string;
    let logMessage: string;

    if (error instanceof OpenAI.APIError) {
      // Specific API errors from OpenAI/DeepSeek
      userFacingMessage = localize(
        "error.aiServiceFailedApi",
        `AI service error: ${error.status} - ${error.message}. Please check your API key or service status.`
      );
      logMessage = `API Error: ${error.status} - ${error.name} - ${error.message} (Type: ${error.type}, Code: ${error.code})`;
    } else if (error instanceof Error) {
      // General JavaScript errors
      userFacingMessage = localize(
        "error.aiServiceFailedGeneral",
        `An unexpected error occurred: ${error.message}. Please try again.`
      );
      logMessage = `General Error: ${error.stack || error.message}`;
    } else {
      // Unknown errors
      userFacingMessage = localize(
        "error.aiServiceFailedUnknown",
        `An unknown error occurred. Please try again.`
      );
      logMessage = `Unknown Error: ${JSON.stringify(error)}`;
    }

    logToFile(logPath, logMessage, "ERROR");
    vscode.window.showErrorMessage(userFacingMessage);
  }
}

// --- Public API --- //

export async function generateFakerMockFromSchema(
  context: vscode.ExtensionContext,
  schema: Schema,
  typeName: string,
  filePath: string
) {
  await generateAndWriteAiContent(context, {
    schema,
    typeName,
    filePath,
    progressTitle: localize(
      "progress.generatingFakerMock",
      "Generating Faker Mock Code..."
    ),
    prompts,
    fileSuffix: ".mock.cjs",
    processContent: (content) =>
      content.replace(/```(?:javascript|js)?\n?|\n?```/g, ""),
  });
}

export async function generateJsonMockFromSchema(
  context: vscode.ExtensionContext,
  schema: Schema,
  typeName: string,
  filePath: string
) {
  await generateAndWriteAiContent(context, {
    schema,
    typeName,
    filePath,
    progressTitle: localize(
      "progress.generatingJsonMock",
      "Generating Mock JSON..."
    ),
    prompts: jsonPrompts,
    fileSuffix: ".mock.json",
    processContent: (content) => {
      try {
        return JSON.stringify(JSON.parse(content), null, 2);
      } catch (e) {
        logToFile(
          path.join(context.globalStoragePath, "ts-mock-generator.log"),
          `Failed to parse generated JSON content. Saved as raw string. Error: ${e}`,
          "ERROR"
        );
        return content; // Return raw content if parsing fails
      }
    },
  });
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
