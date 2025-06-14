import * as vscode from "vscode";
import { generateMockData } from './genCode';
import { generateJsonSchema } from "./genSchema";

export function activate(context: vscode.ExtensionContext) {

  console.log('插件已激活！');

  // 注册右键菜单
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.generateFakerMock', (uri) => {
      generateMockData(context, uri);
    })
  );

  context.subscriptions.push(vscode.commands.registerCommand(
    "extension.generateJsonSchema",
    () => {
      generateJsonSchema();
    })
  );

}
