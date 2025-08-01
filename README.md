# TS Mock Generator VS Code Extension

English | [简体中文](./README_zh-CN.md)

A powerful VS Code extension to generate Mock data from TypeScript interfaces, powered by AI.

## Features

*   **Generate Mock Code**: Generate realistic mock data using Faker.js based on your schemas or TypeScript types.
*   **Generate Mock JSON**: Directly output mock JSON objects.
*   **Generate JSON Schema**: Quickly create JSON schemas from your TypeScript interfaces. Now intelligently processes single-line comments (//) in your TypeScript code, converting them to JSDoc in-memory to ensure richer descriptions in the generated schema without modifying your source files.
*   **AI-Powered Generation**: Leverage DeepSeek AI to intelligently generate mock code and data.
*   **Seamless Integration**: Right-click context menus for easy access within your editor.

## Demo

The following GIF demonstrates how to:
1.  Right-click on a TypeScript type.
2.  Generate Faker.js mock code (`TS -> Faker Mock`).
3.  Open the generated `.mock.js` file.
4.  Run the mock script (`Run MockJS`).
5.  View the output in the terminal.

![TS Mock Generator Demo](https://raw.githubusercontent.com/brahmachen/ts-mock-generator/refs/heads/main/examples/output.gif?raw=true)

## Installation

1.  Open VS Code.
2.  Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X).
3.  Search for "TS Mock Generator" .
4.  Click "Install".

## Configuration

This extension requires a DeepSeek API Key to function. You can configure it in VS Code settings:

1.  Go to `File > Preferences > Settings` (or `Code > Preferences > Settings` on macOS).
2.  Search for "TS Mock Generator".
3.  Enter your API Key in the `TS Mock Generator: Api Key` field.
4.  (Optional) Configure `TS Mock Generator: Api Url`, `TS Mock Generator: Model`, and `TS Mock Generator: Temperature`.

## Usage

### Generating Faker Mock Code from TypeScript

1.  Open a TypeScript file (`.ts` or `.tsx`).
2.  Place your cursor inside or on a TypeScript interface or type definition.
3.  Right-click in the editor.
4.  Select `TS -> Faker Mock`.
5.  A new `.mock.js` file will be generated with Faker.js code.

### Generating Mock JSON from TypeScript

1.  Open a TypeScript file (`.ts` or `.tsx`).
2.  Place your cursor inside or on a TypeScript interface or type definition.
3.  Right-click in the editor.
4.  Select `TS -> JSON Mock`.
5.  A new `.mock.json` file will be generated with mock JSON data.

### Running Generated Mock JS Files

1.  Open a generated `.mock.js` file.
2.  Right-click in the editor.
3.  Select `Run MockJS`.
4.  The output will be displayed in the VS Code output panel.


## Troubleshooting

*   **"API Key is not configured"**: Ensure you have set your DeepSeek API Key in VS Code settings.
*   **"Request to AI service failed"**: Check your internet connection and API Key. The AI service might be temporarily unavailable.
*   **Context menu items not showing**: Ensure you are in a `.ts`, `.tsx`, `.schema.json`, or `.mock.js` file.

## Development

### Building and Asset Copying

To compile the TypeScript source code and copy necessary assets (like `.txt` files for prompts) to the `out` directory, use:

```bash
npm run compile
```

This command ensures that all required files are in place for the extension to run correctly.

### Automated Formatting and Linting

For a seamless development experience, this project is configured to automatically format and fix linting issues on file save within VS Code. This is achieved via the `.vscode/settings.json` file:

*   **Format on Save**: Code will be automatically formatted using Prettier when you save a file.
*   **ESLint Auto Fix**: ESLint issues that can be automatically fixed will be resolved upon saving.

Ensure you have the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VS Code extensions installed for this to work.

## Contributing

Feel free to open issues or submit pull requests on [GitHub](https://github.com/brahmachen/ts-mock-generator).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.