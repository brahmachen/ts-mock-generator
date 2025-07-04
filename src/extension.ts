import * as vscode from "vscode";
import {
    generateMockData,
    generateMockDataJson,
    generateFakerMockFromSchema,
    generateJsonMockFromSchema
} from './genCode';
import { generateJsonSchema, generateSchemaInMemory } from "./genSchema";

export function activate(context: vscode.ExtensionContext) {

    console.log('插件已激活！');

    // 从 .schema.json 文件生成
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.generateFakerMock', (uri) => {
            generateMockData(context, uri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.generateJsonMock', (uri) => {
            generateMockDataJson(context, uri);
        })
    );

    // 从 ts 文件生成 .schema.json
    context.subscriptions.push(vscode.commands.registerCommand(
        "extension.generateJsonSchema",
        () => {
            generateJsonSchema();
        })
    );

    // 从 ts 文件直接生成
    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.generateFakerMockFromTs',
        async () => {
            const result = await generateSchemaInMemory();
            if (result) {
                generateFakerMockFromSchema(context, result.schema, result.typeName, result.filePath);
            }
        }
    ));

    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.generateJsonMockFromTs',
        async () => {
            const result = await generateSchemaInMemory();
            if (result) {
                generateJsonMockFromSchema(context, result.schema, result.typeName, result.filePath);
            }
        }
    ));

}
