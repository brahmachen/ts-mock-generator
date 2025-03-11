import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createGenerator, Config } from "ts-json-schema-generator";

const generateJsonSchema = async () => {
  {
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

      const config: Config = {
        path: filePath,
        tsconfig: findTsConfig(path.dirname(filePath)),
        type: typeName,
        skipTypeCheck : true , // 禁用所有类型检查 
        // skipLibCheck: true, // 忽略声明文件错误
        expose: "export",
        topRef: true,
        jsDoc: "extended",
        markdownDescription: true,
      };

      console.log("Generating schema for", typeName, config);

      const generator = createGenerator(config);
      const schema = generator.createSchema(typeName);

      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
      vscode.window.showInformationMessage(`Schema saved to ${outputPath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error generating schema: ${error}`);
      console.error(error);
      if (error instanceof Error) {
        const diagnostic = (error as any).diagnostic;
        if (diagnostic) {
          console.log({
            messages: diagnostic.relatedInformation.map(
              (item: any) => item.messageText
            ),
          });
        }
      }
    }
  }
};

function findTsConfig(startPath: string): string | undefined {
  let dir = startPath;
  while (dir !== path.parse(dir).root) {
    const tsconfigPath = path.join(dir, "tsconfig.json");
    const tsconfigAppPath = path.join(dir, "tsconfig.app.json");
    if (fs.existsSync(tsconfigAppPath)) {
      return tsconfigAppPath;
    }
    if (fs.existsSync(tsconfigPath)) {
      return tsconfigPath;
    }
    dir = path.dirname(dir);
  }
  return undefined;
}

function findTargetSymbol(
  symbols: vscode.DocumentSymbol[],
  position: vscode.Position
): vscode.DocumentSymbol | null {
  for (const symbol of symbols) {
    // console.log(symbol.kind, vscode.SymbolKind[symbol.kind], symbol.name);
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

export { generateJsonSchema };
