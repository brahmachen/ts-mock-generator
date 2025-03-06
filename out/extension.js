"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ts_json_schema_generator_1 = require("ts-json-schema-generator");
const genCode_1 = require("./genCode");
function activate(context) {
    // 注册右键菜单
    context.subscriptions.push(vscode.commands.registerCommand('extension.generateFakerMock', (uri) => {
        (0, genCode_1.generateMockData)(context, uri);
    }));
    let disposable = vscode.commands.registerCommand("extension.generateJsonSchema", () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor");
            return;
        }
        const document = editor.document;
        const position = editor.selection.active;
        try {
            const symbols = yield vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
            const targetSymbol = findTargetSymbol(symbols, position);
            if (!targetSymbol) {
                vscode.window.showErrorMessage("No type or interface found at this position");
                return;
            }
            const typeName = targetSymbol.name;
            const filePath = document.fileName;
            const outputPath = path.join(path.dirname(filePath), `${typeName}.schema.json`);
            const config = {
                path: filePath,
                tsconfig: findTsConfig(path.dirname(filePath)),
                type: typeName,
            };
            const generator = (0, ts_json_schema_generator_1.createGenerator)(config);
            const schema = generator.createSchema(typeName);
            fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
            vscode.window.showInformationMessage(`Schema saved to ${outputPath}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error generating schema: ${error}`);
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function findTargetSymbol(symbols, position) {
    for (const symbol of symbols) {
        console.log(symbol.kind, vscode.SymbolKind[symbol.kind], symbol.name);
        if ((symbol.kind === vscode.SymbolKind.Interface ||
            symbol.kind === vscode.SymbolKind.Variable) &&
            symbol.range.contains(position)) {
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
function findTsConfig(startPath) {
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
//# sourceMappingURL=extension.js.map