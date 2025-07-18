# TS Mock Generator VS Code 扩展

[English](./README.md) | 简体中文

一款强大的 VS Code 扩展，可根据 TypeScript 接口，利用 AI 驱动生成模拟数据（Mock data）。

## ✨ 功能特性

*   **生成模拟代码**: 基于您的 TypeScript 类型或 JSON Schema，使用 Faker.js 生成逼真的模拟数据代码。
*   **生成模拟 JSON**: 直接输出模拟的 JSON 对象。
*   **生成 JSON Schema**: 从您的 TypeScript 接口快速创建 JSON Schema。
*   **AI 驱动生成**: 利用 DeepSeek AI 智能生成模拟代码和数据。
*   **无缝集成**: 通过右键上下文菜单在编辑器内轻松访问。

## 🚀 Demo 演示

下面的 GIF 演示了如何：
1.  在 TypeScript 类型上右键单击。
2.  选择 `TS -> Faker Mock` 生成 Faker.js 模拟代码。
3.  打开生成的 `.mock.js` 文件。
4.  选择 `Run MockJS` 运行模拟脚本。
5.  在终端中查看输出结果。

![TS Mock Generator Demo](https://raw.githubusercontent.com/your-username/ts-mock-generator/main/images/demo.gif)

## 📦 安装

1.  打开 VS Code。
2.  前往“扩展”视图 (Ctrl+Shift+X 或 Cmd+Shift+X)。
3.  搜索 "TS Mock Generator"。
4.  点击“安装”。

## ⚙️ 配置

本扩展需要配置 DeepSeek API 密钥才能正常工作。您可以在 VS Code 设置中进行配置：

1.  前往 `文件 > 首选项 > 设置` (在 macOS 上是 `Code > 首选项 > 设置`)。
2.  搜索 "DeepSeek"。
3.  在 `DeepSeek: Api Key` 字段中输入您的 API 密钥。
4.  (可选) 配置 `DeepSeek: Api Url`, `DeepSeek: Model`, 和 `DeepSeek: Temperature`。

## 💡 使用方法

### 从 TypeScript 生成 Faker 模拟代码

1.  打开一个 TypeScript 文件 (`.ts` 或 `.tsx`)。
2.  将光标放在一个 TypeScript `interface` 或 `type` 定义上。
3.  在编辑器中右键单击。
4.  选择 `TS -> Faker Mock`。
5.  一个新的 `.mock.js` 文件将会被创建，其中包含 Faker.js 代码。

### 从 TypeScript 生成模拟 JSON

1.  打开一个 TypeScript 文件 (`.ts` 或 `.tsx`)。
2.  将光标放在一个 TypeScript `interface` 或 `type` 定义上。
3.  在编辑器中右键单击。
4.  选择 `TS -> JSON Mock`。
5.  一个新的 `.mock.json` 文件将会被创建，其中包含模拟的 JSON 数据。

### 运行生成的 Mock JS 文件

1.  打开一个已生成的 `.mock.js` 文件。
2.  在编辑器中右键单击。
3.  选择 `Run MockJS`。
4.  输出结果将显示在 VS Code 的输出面板中。

## 🤔 问题排查

*   **"API Key is not configured"**: 请确保您已在 VS Code 设置中填写了 DeepSeek API 密钥。
*   **"Request to AI service failed"**: 请检查您的网络连接和 API 密钥是否正确。AI 服务可能暂时不可用。
*   **右键菜单项未显示**: 请确保您当前操作的文件是 `.ts`, `.tsx`, `.schema.json`, 或 `.mock.js` 类型。

## 🤝 参与贡献

欢迎在 [GitHub](https://github.com/brahmachen/ts-mock-generator) 上提交问题 (issues) 或拉取请求 (pull requests)。

## 📄 许可证

本项目基于 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
