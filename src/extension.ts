import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createGenerator } from "ts-json-schema-generator";
import { generateMockData } from './genCode';

export function activate(context: vscode.ExtensionContext) {

  // 注册右键菜单
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.generateFakerMock', (uri) => {
      generateMockData(context, uri);
    })
  );

  let disposable = vscode.commands.registerCommand(
    "extension.generateJsonSchema",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;

      try {
        const symbols: any = await vscode.commands.executeCommand(
          "vscode.executeDocumentSymbolProvider",
          document.uri
        );

        const targetSymbol = findTargetSymbol(symbols, position);
        if (!targetSymbol) {
          vscode.window.showErrorMessage(
            "No type or interface found at this position"
          );
          return;
        }

        const typeName = targetSymbol.name;
        const filePath = document.fileName;
        const outputPath = path.join(
          path.dirname(filePath),
          `${typeName}.schema.json`
        );

        const config = {
          path: filePath,
          tsconfig: findTsConfig(path.dirname(filePath)),
          type: typeName,
        };

        const generator = createGenerator(config);
        const schema = generator.createSchema(typeName);

        fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
        vscode.window.showInformationMessage(
          `Schema saved to ${outputPath}`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error generating schema: ${error}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function findTargetSymbol(
  symbols: vscode.DocumentSymbol[],
  position: vscode.Position
): vscode.DocumentSymbol | null {
  for (const symbol of symbols) {
    console.log(symbol.kind, vscode.SymbolKind[symbol.kind], symbol.name);
    if (
      (symbol.kind === vscode.SymbolKind.Interface ||
        symbol.kind === vscode.SymbolKind.Variable) &&
      symbol.range.contains(position)
    ) {
      return symbol;
    }
    if (symbol.children) {
      const childResult = findTargetSymbol(symbol.children, position);
      if (childResult) {
        return childResult;
      }
    }
  }
  return null;
}

function findTsConfig(startPath: string): string | undefined {
  let dir = startPath;
  while (dir !== path.parse(dir).root) {
    const tsconfigPath = path.join(dir, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      return tsconfigPath;
    }
    dir = path.dirname(dir);
  }
  return undefined;
}
