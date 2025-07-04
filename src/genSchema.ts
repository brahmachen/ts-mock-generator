import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createGenerator, Config, Schema } from "ts-json-schema-generator";

async function generateSchemaInMemory(): Promise<{
  schema: Schema;
  typeName: string;
  filePath: string;
} | null> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return null;
  }

  const document = editor.document;
  const position = editor.selection.active;

  try {
    const symbols: vscode.DocumentSymbol[] | undefined =
      await vscode.commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        document.uri
      );

    if (!symbols) {
      vscode.window.showErrorMessage("Could not retrieve document symbols.");
      return null;
    }

    const targetSymbol = findTargetSymbol(symbols, position);
    if (!targetSymbol) {
      vscode.window.showErrorMessage(
        "No type or interface found at this position"
      );
      return null;
    }

    const typeName = targetSymbol.name;
    const filePath = document.fileName;

    const config: Config = {
      path: filePath,
      tsconfig: findTsConfig(path.dirname(filePath)),
      type: typeName,
      skipTypeCheck: true, // 禁用所有类型检查
      expose: "export",
      topRef: true,
      jsDoc: "extended",
      markdownDescription: false,
    };

    console.log("Generating schema in-memory for", typeName);

    const generator = createGenerator(config);
    const schema = generator.createSchema(typeName);

    return { schema, typeName, filePath };
  } catch (error) {
    vscode.window.showErrorMessage(`Error generating schema: ${error}`);
    console.error(error);
    if (error instanceof Error) {
      const diagnostic = (
        error as {
          diagnostic?: { relatedInformation?: Array<{ messageText: string }> };
        }
      ).diagnostic;
      if (diagnostic && diagnostic.relatedInformation) {
        console.log({
          messages: diagnostic.relatedInformation.map(
            (item: { messageText: string }) => item.messageText
          ),
        });
      }
    }
    return null;
  }
}

const generateJsonSchema = async () => {
  const result = await generateSchemaInMemory();

  if (result) {
    const { schema, typeName, filePath } = result;
    const outputPath = path.join(
      path.dirname(filePath),
      `${typeName}.schema.json`
    );

    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    vscode.window.showInformationMessage(`Schema saved to ${outputPath}`);
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

export { generateJsonSchema, generateSchemaInMemory };
