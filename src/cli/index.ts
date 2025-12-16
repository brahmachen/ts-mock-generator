#!/usr/bin/env node
import { Command } from "commander";
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { generateSchema } from "./schema";
import { generateFakerCode, generateJsonData } from "./ai";

dotenv.config();

const program = new Command();

program
  .name("ts-mock-gen")
  .description("Generate mock data from TypeScript interfaces using AI")
  .version("1.0.0");

program
  .argument("<file>", "Path to the TypeScript file with type name (e.g. src/types.ts:User)")
  .option("-p, --project <path>", "Path to tsconfig.json or project root")
  .option("-o, --out <dir>", "Output directory", ".")
  .option("-n, --name <filename>", "Output filename")
  .option("--json", "Generate JSON data instead of Faker.js code")
  .option("--api-key <key>", "DeepSeek API Key (or set DEEPSEEK_API_KEY env var)")
  .option("--api-url <url>", "DeepSeek API URL", "https://api.deepseek.com/v1")
  .option("--model <model>", "AI Model", "deepseek-chat")
  .option("--temperature <temp>", "Temperature", parseFloat, 0.3)
  .action(async (fileArg, options) => {
    try {
      const [filePath, typeName] = fileArg.split(":");
      
      if (!filePath || !typeName) {
        console.error("Error: Invalid file argument. Format must be 'path/to/file.ts:TypeName'");
        process.exit(1);
      }

      const absoluteFilePath = path.resolve(process.cwd(), filePath);
      if (!fs.existsSync(absoluteFilePath)) {
        console.error(`Error: File not found: ${absoluteFilePath}`);
        process.exit(1);
      }

      const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        console.error("Error: API Key is required. Use --api-key or set DEEPSEEK_API_KEY env var.");
        process.exit(1);
      }

      console.log(`Generating schema for type '${typeName}' in '${filePath}'...`);
      
      const schema = generateSchema(absoluteFilePath, typeName, options.project);
      
      console.log("Schema generated. Calling AI...");

      let outputContent: string;
      let outputExt: string;

      if (options.json) {
        outputContent = await generateJsonData(schema, {
          apiKey,
          apiUrl: options.apiUrl,
          model: options.model,
          temperature: options.temperature
        });
        outputExt = ".json";
      } else {
        outputContent = await generateFakerCode(schema, {
          apiKey,
          apiUrl: options.apiUrl,
          model: options.model,
          temperature: options.temperature
        });
        outputExt = ".js";
      }

      const outDir = path.resolve(process.cwd(), options.out);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      const fileName = options.name || `${typeName}.mock${outputExt}`;
      const outputPath = path.join(outDir, fileName);

      fs.writeFileSync(outputPath, outputContent);
      console.log(`Success! Mock data saved to: ${outputPath}`);

    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
