import * as vscode from "vscode";
import { spawn } from "child_process";
import * as path from "path";

let outputChannel: vscode.OutputChannel;

export function runMockJs(context: vscode.ExtensionContext, uri: vscode.Uri) {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("Mock JS Runner");
  }
  outputChannel.clear();
  outputChannel.show(true);

  const filePath = uri.fsPath;
  outputChannel.appendLine(`Running: ${filePath}\n`);

  // 获取扩展的 node_modules 路径
  const extensionNodeModulesPath = path.join(context.extensionPath, "node_modules");

  const child = spawn("node", [filePath], {
    env: { ...process.env, NODE_PATH: extensionNodeModulesPath },
  });

  child.stdout.on("data", (data) => {
    outputChannel.appendLine(data.toString());
  });

  child.stderr.on("data", (data) => {
    outputChannel.appendLine(`Error: ${data.toString()}`);
  });

  child.on("close", (code) => {
    if (code === 0) {
      outputChannel.appendLine(`\nExecution finished successfully.`);
    } else {
      outputChannel.appendLine(`\nExecution failed with exit code ${code}.`);
    }
  });

  child.on("error", (err) => {
    outputChannel.appendLine(`Failed to start subprocess: ${err.message}`);
    vscode.window.showErrorMessage(`Failed to run mock JS: ${err.message}`);
  });
}