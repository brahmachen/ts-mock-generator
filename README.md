# JSON Schema Generator VS Code Extension

A powerful VS Code extension to generate JSON Schema and Mock data from TypeScript interfaces, powered by AI.

## Features

*   **Generate JSON Schema**: Quickly create JSON schemas from your TypeScript interfaces.
*   **Generate Mock Code**: Generate realistic mock data using Faker.js based on your schemas or TypeScript types.
*   **Generate Mock JSON**: Directly output mock JSON objects.
*   **AI-Powered Generation**: Leverage DeepSeek AI to intelligently generate mock code and data.
*   **Seamless Integration**: Right-click context menus for easy access within your editor.

## Installation

1.  Open VS Code.
2.  Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X).
3.  Search for "JSON Schema Generator" (or your extension's display name).
4.  Click "Install".

## Configuration

This extension requires a DeepSeek API Key to function. You can configure it in VS Code settings:

1.  Go to `File > Preferences > Settings` (or `Code > Preferences > Settings` on macOS).
2.  Search for "DeepSeek".
3.  Enter your API Key in the `DeepSeek: Api Key` field.
4.  (Optional) Configure `DeepSeek: Api Url`, `DeepSeek: Model`, and `DeepSeek: Temperature`.

## Usage

### Generating JSON Schema from TypeScript

1.  Open a TypeScript file (`.ts` or `.tsx`).
2.  Place your cursor inside or on a TypeScript interface or type definition.
3.  Right-click in the editor.
4.  Select `Generate JSON Schema`.
5.  A new `.schema.json` file will be generated next to your TypeScript file.

### Generating Faker Mock Code from TypeScript

1.  Open a TypeScript file (`.ts` or `.tsx`).
2.  Place your cursor inside or on a TypeScript interface or type definition.
3.  Right-click in the editor.
4.  Select `Generate Faker Mock Code (Directly)`.
5.  A new `.mock.js` file will be generated with Faker.js code.

### Generating Mock JSON from TypeScript

1.  Open a TypeScript file (`.ts` or `.tsx`).
2.  Place your cursor inside or on a TypeScript interface or type definition.
3.  Right-click in the editor.
4.  Select `Generate Mock JSON (Directly)`.
5.  A new `.mock.json` file will be generated with mock JSON data.

### Running Generated Mock JS Files

1.  Open a generated `.mock.js` file.
2.  Right-click in the editor.
3.  Select `Run Mock JS`.
4.  The output will be displayed in the VS Code output panel.

## Troubleshooting

*   **"API Key is not configured"**: Ensure you have set your DeepSeek API Key in VS Code settings.
*   **"Request to AI service failed"**: Check your internet connection and API Key. The AI service might be temporarily unavailable.
*   **Context menu items not showing**: Ensure you are in a `.ts`, `.tsx`, `.schema.json`, or `.mock.js` file.

## Contributing

Feel free to open issues or submit pull requests on [GitHub](https://github.com/your-username/schema-generator).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
