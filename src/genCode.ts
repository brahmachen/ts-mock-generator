import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import prompts from "./prompt";

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

export async function generateMockData(
  context: vscode.ExtensionContext,
  uri: vscode.Uri
) {
  // 初始化日志路径
  const logDir = context.globalStorageUri.fsPath;
  const logPath = path.join(logDir, "deepseek-mock-generator.log");

  try {
    // 开始loading
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "生成中...",
        cancellable: false,
      },
      async () => {
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        // 读取Schema文件
        const schemaContent = fs.readFileSync(uri.fsPath, "utf-8");
        const schemaName = path.basename(uri.fsPath, ".schema.json");

        // 构造请求内容
        const finalPrompt = prompts.userPrompt.replace(
          "{SCHEMA_CONTENT}",
          schemaContent
        );

        // 获取API配置
        const config = vscode.workspace.getConfiguration("deepseek");
        const apiKey = config.get<string>("apiKey");
        const apiBase = config.get<string>(
          "apiUrl",
          "https://api.deepseek.com/v1"
        );

        // 记录API配置（脱敏处理）
        logToFile(
          logPath,
          ` API Configuration: ${JSON.stringify({
            apiBase,
            model: "deepseek-chat",
            temperature: 0.3,
          })} `
        );

        // 调用API
        const openai = new OpenAI({
          apiKey,
          baseURL: apiBase,
        });

        // 构造请求参数
        const requestParams = {
          model: "deepseek-chat",
          messages: [
            { role: "system", content: prompts.systemPrompt },
            { role: "user", content: finalPrompt },
          ],
          temperature: 0.3,
        };
        // 记录请求参数
        logToFile(
          logPath,
          ` Sending OpenAI request: ${JSON.stringify(requestParams, null, 2)} `
        );
        const response = await openai.chat.completions.create(
          requestParams as any
        );
        // 记录完整响应
        logToFile(
          logPath,
          ` Received OpenAI response: ${JSON.stringify(response, null, 2)} `
        );

        // 保存生成代码
        const targetPath = path.join(
          path.dirname(uri.fsPath),
          `${schemaName}.generated.mock.js`
        );

        fs.writeFileSync(targetPath, response.choices[0].message.content || "");

        logToFile(logPath, ` Mock data saved to: ${targetPath} `);

        vscode.window.showInformationMessage(
          `Mock数据生成成功 ➜ ${path.basename(targetPath)}`
        );
      }
    );
  } catch (error) {
    // 记录错误信息
    const errorMessage =
      error instanceof Error
        ? error.stack || error.message
        : JSON.stringify(error);
    logToFile(logPath, ` Error occurred: ${errorMessage} `, "ERROR");
    vscode.window.showErrorMessage(
      ` 生成失败: ${error instanceof Error ? error.message : "Unknown error"} `
    );
  }
}
