import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { createGenerator, Config, Schema } from "ts-json-schema-generator";

export function convertSingleLineCommentsToJsDoc(code: string): string {
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

export function findTsConfig(startPath: string): string | undefined {
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

export function generateSchema(
  filePath: string,
  typeName: string,
  tsconfigPath?: string
): Schema {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const originalContent = fs.readFileSync(filePath, "utf8");
  const convertedContent = convertSingleLineCommentsToJsDoc(originalContent);

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `temp_${Date.now()}.ts`);
  fs.writeFileSync(tempFilePath, convertedContent);

  try {
    let resolvedTsConfig = tsconfigPath;
    
    // If tsconfigPath is a directory, try to find tsconfig.json inside it
    if (resolvedTsConfig && fs.existsSync(resolvedTsConfig) && fs.statSync(resolvedTsConfig).isDirectory()) {
      const possibleConfig = path.join(resolvedTsConfig, "tsconfig.json");
      if (fs.existsSync(possibleConfig)) {
        resolvedTsConfig = possibleConfig;
      }
    }

    if (!resolvedTsConfig) {
      resolvedTsConfig = findTsConfig(path.dirname(filePath));
    }
    
    const config: Config = {
      path: tempFilePath,
      tsconfig: resolvedTsConfig,
      type: typeName,
      skipTypeCheck: true,
      expose: "all",
      topRef: true,
      jsDoc: "extended",
      markdownDescription: false,
    };

    const generator = createGenerator(config);
    const schema = generator.createSchema(typeName);
    return schema;
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
