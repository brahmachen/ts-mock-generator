import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from "openai";
import prompts from './prompt';


export async function generateMockData(context: vscode.ExtensionContext, uri: vscode.Uri) {
  try {
    // 读取Schema文件
    const schemaContent = fs.readFileSync(uri.fsPath, 'utf-8');
    const schemaName = path.basename(uri.fsPath, '.schema.json');

    // 构造请求内容
    const finalPrompt = prompts.userPrompt.replace('{SCHEMA_CONTENT}', schemaContent);

    // 获取API配置
    const config = vscode.workspace.getConfiguration('deepseek');
    const apiKey = config.get<string>('apiKey');
    const apiBase = config.get<string>('apiUrl', 'https://api.deepseek.com/v1');

    // 调用API
    const openai = new OpenAI({
      apiKey,
      baseURL: apiBase
    });

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: prompts.systemPrompt },
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.3
    });

    // 保存生成代码
    const targetPath = path.join(
      path.dirname(uri.fsPath),
      `${schemaName}.generated.mock.js`
    );

    // response.choices[0].message.content

    fs.writeFileSync(targetPath, response.choices[0].message.content || '');

    vscode.window.showInformationMessage(`Mock数据生成成功 ➜ ${path.basename(targetPath)}`);
  } catch (error) {
    vscode.window.showErrorMessage(`生成失败: ${error}`);
  }
}
