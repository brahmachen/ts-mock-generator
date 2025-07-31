import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createGenerator, Config, Schema } from "ts-json-schema-generator";
import * as nls from "vscode-nls";
import * as os from "os";

const localize = nls.loadMessageBundle();

function convertSingleLineCommentsToJsDoc(code: string): string {
  const lines = code.split("\n");
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Case 1: Comment at the end of a line with code
    const endOfLineCommentMatch = line.match(/^(.*?[;|,])\s*\/\/\s*(.*)$/);
    if (endOfLineCommentMatch) {
      const codePart = endOfLineCommentMatch[1];
      const commentText = endOfLineCommentMatch[2].trim();
      const indentation = line.match(/^\s*/)?.[0] || "";
      newLines.push(
        `${indentation}/**\n${indentation} * ${commentText}\n${indentation} */`
      );
      newLines.push(codePart);
      continue;
    }

    // Case 2: Comment on its own line before a line with code
    if (trimmedLine.startsWith("//")) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim() && !nextLine.trim().startsWith("//")) {
        const commentText = trimmedLine.substring(2).trim();
        const indentation = line.match(/^\s*/)?.[0] || "";
        newLines.push(
          `${indentation}/**\n${indentation} * ${commentText}\n${indentation} */`
        );
        continue;
      }
    }

    newLines.push(line);
  }

  return newLines.join("\n");
}

async function generateSchemaInMemory(
  context: vscode.ExtensionContext
): Promise<{
  schema: Schema;
  typeName: string;
  filePath: string;
} | null> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage(
      localize("error.noActiveEditor", "No active editor")
    );
    return null;
  }

  const document = editor.document;
  const position = editor.selection.active;
  let tempFilePath = "";

  try {
    const symbols: vscode.DocumentSymbol[] | undefined =
      await vscode.commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        document.uri
      );

    if (!symbols) {
      vscode.window.showErrorMessage(
        localize(
          "error.couldNotRetrieveSymbols",
          "Could not retrieve document symbols."
        )
      );
      return null;
    }

    const targetSymbol = findTargetSymbol(symbols, position);
    if (!targetSymbol) {
      vscode.window.showErrorMessage(
        localize(
          "error.noTypeOrInterfaceFound",
          "No type or interface found at this position"
        )
      );
      return null;
    }

    const typeName = targetSymbol.name;
    const filePath = document.fileName;

    const originalContent = fs.readFileSync(filePath, "utf8");
    const convertedContent = convertSingleLineCommentsToJsDoc(originalContent);

    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `temp_${Date.now()}.ts`);
    fs.writeFileSync(tempFilePath, convertedContent);

    const config: Config = {
      path: tempFilePath,
      tsconfig: findTsConfig(path.dirname(filePath)),
      type: typeName,
      skipTypeCheck: true,
      expose: "all",
      topRef: true,
      jsDoc: "extended",
      markdownDescription: false,
    };

    console.log(
      localize(
        "info.generatingSchemaInMemory",
        "Generating schema in-memory for"
      ),
      typeName
    );

    const generator = createGenerator(config);
    const schema = generator.createSchema(typeName);

    if (context.extensionMode === vscode.ExtensionMode.Development) {
      const outputPath = path.join(
        path.dirname(filePath),
        `${typeName}.debug.schema.json`
      );
      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
      console.log(`Debug schema saved to ${outputPath}`);
    }

    return { schema, typeName, filePath };
  } catch (error) {
    vscode.window.showErrorMessage(
      localize("error.generatingSchema", `Error generating schema: ${error}`)
    );
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
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

const generateJsonSchema = async (context: vscode.ExtensionContext) => {
  const result = await generateSchemaInMemory(context);

  if (result) {
    const { schema, typeName, filePath } = result;
    const outputPath = path.join(
      path.dirname(filePath),
      `${typeName}.schema.json`
    );

    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    vscode.window.showInformationMessage(
      localize("info.schemaSaved", `Schema saved to ${outputPath}`)
    );
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
        symbol.kind === vscode.SymbolKind.Struct ||
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
