import * as vscode from "vscode";
import { generateMockData } from './genCode';
import { generateJsonSchema } from "./genSchema";

export function activate(context: vscode.ExtensionContext) {

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
