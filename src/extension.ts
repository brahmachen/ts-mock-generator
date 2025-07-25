import * as vscode from "vscode";
import {
  generateMockData,
  generateMockDataJson,
  generateFakerMockFromSchema,
  generateJsonMockFromSchema,
} from "./genCode";
import { generateJsonSchema, generateSchemaInMemory } from "./genSchema";
import { runMockJs } from "./runCode";

import * as nls from "vscode-nls";

const localize = nls.loadMessageBundle();

export function activate(context: vscode.ExtensionContext) {
  console.log(localize("extension.activated", "插件已激活！"));

  // 从 .schema.json 文件生成
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.generateFakerMock", (uri) => {
      generateMockData(context, uri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.generateJsonMock", (uri) => {
      generateMockDataJson(context, uri);
    })
  );

  // 从 ts 文件生成 .schema.json
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.generateJsonSchema", () => {
      generateJsonSchema(context);
    })
  );

  // 从 ts 文件直接生成
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.generateFakerMockFromTs",
      async () => {
        const result = await generateSchemaInMemory(context);
        if (result) {
          generateFakerMockFromSchema(
            context,
            result.schema,
            result.typeName,
            result.filePath
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.generateJsonMockFromTs",
      async () => {
        const result = await generateSchemaInMemory(context);
        if (result) {
          generateJsonMockFromSchema(
            context,
            result.schema,
            result.typeName,
            result.filePath
          );
        }
      }
    )
  );

  // 运行生成的 mock.js 文件
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.runMockJs",
      (uri: vscode.Uri) => {
        runMockJs(context, uri);
      }
    )
  );
}
