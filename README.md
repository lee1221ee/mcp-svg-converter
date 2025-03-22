# MCP SVG Converter

[![npm version](https://img.shields.io/npm/v/mcp-svg-converter.svg)](https://www.npmjs.com/package/mcp-svg-converter)
[![Downloads](https://img.shields.io/npm/dt/mcp-svg-converter.svg)](https://www.npmjs.com/package/mcp-svg-converter)
[![License](https://img.shields.io/npm/l/mcp-svg-converter.svg)](https://github.com/surferdot/mcp-svg-converter/blob/main/LICENSE)

[English](#english) | [中文](#中文)

<a name="english"></a>
## English

A Model Context Protocol (MCP) server that provides tools for converting SVG code to high-quality PNG and JPG images with detailed customization options.

### Features

- Convert SVG code to high-quality PNG images with transparency support
- Convert SVG code to high-quality JPG images with customizable quality settings
- Automatic dimension detection and preservation from original SVG
- Support for scaling to higher resolutions
- Background color customization
- Intelligent path handling with automatic redirection to allowed directories
- Secure file system access with configurable permissions

### Installation

#### Quick Install with npx

```bash
npx mcp-svg-converter /path/to/allowed/directory
```

#### Global Installation

```bash
npm install -g mcp-svg-converter
mcp-svg-converter /path/to/allowed/directory
```

#### From Source

##### Prerequisites

- Node.js 16 or higher
- npm or yarn

##### Installation Steps

1. Clone this repository
   ```bash
   git clone https://github.com/surferdot/mcp-svg-converter.git
   cd mcp-svg-converter
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the project
   ```bash
   npm run build
   ```

### Usage

#### As a standalone server

Run the server by specifying one or more allowed directories where the converted images can be saved:

```bash
node build/index.js /path/to/allowed/directory1 /path/to/allowed/directory2
```

#### With Claude Desktop

1. Download and install [Claude Desktop](https://claude.ai/download)
2. Create or confirm you have access to an output directory:
   ```bash
   # macOS/Linux
   mkdir -p ~/Desktop/svg-output
   
   # Windows
   mkdir "%USERPROFILE%\Desktop\svg-output"
   ```

3. Configure Claude Desktop by editing the configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

4. Open the Claude app, click on the Claude menu in your system menu bar and select "Settings..."
5. Click on "Developer" in the left sidebar
6. Click "Edit Config" to open the configuration file

7. Add this server configuration:

##### Using npm package with npx (recommended)

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "npx",
      "args": [
        "mcp-svg-converter",
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

##### Using global installation

If you've installed the package globally:

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "mcp-svg-converter",
      "args": [
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

##### Using local build

If you've built from source:

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-svg-converter/build/index.js",
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

8. Save the file and restart Claude Desktop

#### Verifying the Setup

When Claude Desktop restarts, if configured correctly:

1. You should see a hammer icon <img src="https://mintlify.s3.us-west-1.amazonaws.com/mcp/images/claude-desktop-mcp-hammer-icon.svg" style="display: inline; height: 1.3em; vertical-align: middle"> at the bottom right of the input box indicating MCP tools are available.
2. Clicking the hammer icon should show the `svg-to-png` and `svg-to-jpg` tools.

### Examples in Claude Desktop

#### Example 1: Converting a Simple SVG to PNG

In Claude Desktop, send a message like:

```
Please convert this SVG to PNG and save it to my output directory:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <rect x="10" y="10" width="80" height="80" fill="#4285f4" />
  <circle cx="140" cy="50" r="40" fill="#ea4335" />
  <path d="M10 50 L90 50 L50 90 Z" fill="#fbbc05" />
  <text x="100" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="#34a853">SVG Example</text>
</svg>
```

#### Example 2: High-Quality JPG Conversion

```
Please convert this SVG to a JPG with 95% quality and 2x scaling:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f0f0f0" />
  <circle cx="100" cy="100" r="80" fill="#ff6b6b" />
  <path d="M100 50 L130 150 L70 150 Z" fill="white" />
</svg>
```

### Tools

#### svg-to-png

Converts SVG code to a high-quality PNG image with transparency support.

**Parameters:**
- `svgCode` (string, required): The SVG code to convert
- `outputPath` (string, required): Path where the PNG file should be saved
- `backgroundColor` (string, optional): Background color (default: transparent)
- `scale` (number, optional): Scale factor for higher resolution (default: 1)

#### svg-to-jpg

Converts SVG code to a high-quality JPG image.

**Parameters:**
- `svgCode` (string, required): The SVG code to convert
- `outputPath` (string, required): Path where the JPG file should be saved
- `backgroundColor` (string, optional): Background color (default: white)
- `quality` (number, optional): JPEG quality from 1-100 (default: 90)
- `scale` (number, optional): Scale factor for higher resolution (default: 1)

### Advanced Usage Tips

#### Specifying Multiple Output Directories

You can specify multiple allowed output directories for more flexible file saving:

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "npx",
      "args": [
        "mcp-svg-converter",
        "/Users/yourusername/Desktop/svg-output",
        "/Users/yourusername/Documents/svg-images",
        "/Users/yourusername/Downloads"
      ]
    }
  }
}
```

#### Using Custom Output Filenames

Specify detailed file paths in your request:

```
Please convert this SVG to PNG, and save it as "colorful_shapes.png" in my output directory.

<svg>...</svg>
```

#### Automatic Path Redirection

If you request saving to a non-allowed directory, the converter automatically redirects to an allowed directory and informs you of the actual save location.

### Troubleshooting

#### Claude Doesn't Show MCP Tools Icon
1. Verify the configuration file has correct JSON syntax
2. Ensure all paths are absolute paths
3. Make sure output directories exist and are writable
4. Completely exit and restart Claude Desktop
5. Check Claude logs:
   - macOS: `~/Library/Logs/Claude/mcp*.log`
   - Windows: `%APPDATA%\Claude\logs\mcp*.log`

#### Tool Execution Fails
1. Ensure `mcp-svg-converter` is correctly installed
2. Check output directory permissions
3. Verify the SVG code is valid
4. Check Claude logs for detailed error messages

#### "Command Not Found" Error
1. Ensure `mcp-svg-converter` is globally installed or correctly reference `npx`
2. Confirm npm's global bin directory is in your PATH
3. Try using full paths in configuration

### Debugging

You can use the MCP Inspector to debug and test the server directly:

```bash
npx @modelcontextprotocol/inspector npx mcp-svg-converter /path/to/allowed/directory
```

This opens an interactive interface where you can test all available tools without going through Claude Desktop.

### Security Considerations

- The server will only write files to the directories specified when starting the server
- If a user attempts to save to a non-allowed directory, the file will be automatically redirected to an allowed directory
- Path traversal attacks are prevented by proper path validation

### License

MIT

---

<a name="中文"></a>
## 中文

MCP SVG 转换器是一个基于模型上下文协议 (MCP) 的服务器，提供将 SVG 代码转换为高质量 PNG 和 JPG 图像的工具，支持详细的自定义选项。

### 特点

- 将 SVG 代码转换为支持透明度的高质量 PNG 图像
- 将 SVG 代码转换为可定制质量设置的高质量 JPG 图像
- 自动检测并保留原始 SVG 的尺寸
- 支持缩放到更高分辨率
- 可自定义背景颜色
- 智能路径处理，自动重定向到允许的目录
- 可配置权限的安全文件系统访问

### 安装

#### 使用 npx 快速安装

```bash
npx mcp-svg-converter /path/to/allowed/directory
```

#### 全局安装

```bash
npm install -g mcp-svg-converter
mcp-svg-converter /path/to/allowed/directory
```

#### 从源代码安装

##### 前提条件

- Node.js 16 或更高版本
- npm 或 yarn

##### 安装步骤

1. 克隆此仓库
   ```bash
   git clone https://github.com/surferdot/mcp-svg-converter.git
   cd mcp-svg-converter
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 构建项目
   ```bash
   npm run build
   ```

### 使用方法

#### 作为独立服务器运行

通过指定一个或多个允许存储转换后图像的目录来运行服务器：

```bash
node build/index.js /path/to/allowed/directory1 /path/to/allowed/directory2
```

#### 与 Claude Desktop 一起使用

1. 下载并安装 [Claude Desktop](https://claude.ai/download)
2. 创建或确认你有权限访问的输出目录：
   ```bash
   # macOS/Linux
   mkdir -p ~/Desktop/svg-output
   
   # Windows
   mkdir "%USERPROFILE%\Desktop\svg-output"
   ```

3. 配置 Claude Desktop：
   - 打开 Claude 应用程序
   - 点击系统菜单栏中的 Claude 图标
   - 选择"Settings..."（设置）
   - 在左侧菜单中选择"Developer"（开发者）
   - 点击"Edit Config"（编辑配置）按钮

4. 编辑配置文件：
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

5. 添加服务器配置：

##### 使用 npm 包与 npx（推荐）

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "npx",
      "args": [
        "mcp-svg-converter",
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

##### 使用全局安装

如果你已全局安装了此包：

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "mcp-svg-converter",
      "args": [
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

##### 使用本地构建

如果你从源代码构建：

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-svg-converter/build/index.js",
        "/absolute/path/to/output/directory"
      ]
    }
  }
}
```

6. 保存文件并重启 Claude Desktop

#### 验证设置

当 Claude Desktop 重启后，如果配置正确：

1. 你应该在输入框右下角看到一个锤子图标 <img src="https://mintlify.s3.us-west-1.amazonaws.com/mcp/images/claude-desktop-mcp-hammer-icon.svg" style="display: inline; height: 1.3em; vertical-align: middle">，表示 MCP 工具可用。
2. 点击锤子图标应显示 `svg-to-png` 和 `svg-to-jpg` 工具。

### Claude Desktop 中的使用示例

#### 示例 1：将简单 SVG 转换为 PNG

在 Claude Desktop 中发送以下消息：

```
请将这个 SVG 转换为 PNG 并保存到我的输出目录：

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
  <rect x="10" y="10" width="80" height="80" fill="#4285f4" />
  <circle cx="140" cy="50" r="40" fill="#ea4335" />
  <path d="M10 50 L90 50 L50 90 Z" fill="#fbbc05" />
  <text x="100" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="#34a853">SVG 示例</text>
</svg>
```

#### 示例 2：高质量 JPG 转换

```
请将这个 SVG 转换为 95% 质量和 2 倍缩放的 JPG 图像：

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f0f0f0" />
  <circle cx="100" cy="100" r="80" fill="#ff6b6b" />
  <path d="M100 50 L130 150 L70 150 Z" fill="white" />
</svg>
```

### 工具

#### svg-to-png

将 SVG 代码转换为支持透明度的高质量 PNG 图像。

**参数：**
- `svgCode` (字符串，必需)：要转换的 SVG 代码
- `outputPath` (字符串，必需)：PNG 文件的保存路径
- `backgroundColor` (字符串，可选)：背景颜色 (默认：透明)
- `scale` (数字，可选)：更高分辨率的缩放因子 (默认：1)

#### svg-to-jpg

将 SVG 代码转换为高质量 JPG 图像。

**参数：**
- `svgCode` (字符串，必需)：要转换的 SVG 代码
- `outputPath` (字符串，必需)：JPG 文件的保存路径
- `backgroundColor` (字符串，可选)：背景颜色 (默认：白色)
- `quality` (数字，可选)：JPEG 质量，范围从 1 到 100 (默认：90)
- `scale` (数字，可选)：更高分辨率的缩放因子 (默认：1)

### 高级使用技巧

#### 指定多个输出目录

你可以指定多个允许的输出目录，以提供更灵活的文件保存选项：

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "npx",
      "args": [
        "mcp-svg-converter",
        "/Users/yourusername/Desktop/svg-output",
        "/Users/yourusername/Documents/svg-images",
        "/Users/yourusername/Downloads"
      ]
    }
  }
}
```

#### 使用自定义输出文件名

在请求中指定详细的文件路径：

```
请将这个 SVG 转换为 PNG，并以文件名 "colorful_shapes.png" 保存到输出目录。

<svg>...</svg>
```

#### 自动路径重定向

如果你请求保存到一个不允许的目录，转换器会自动将文件重定向到允许的目录，并在响应中告知你实际的保存位置。

### 故障排除

#### Claude 没有显示 MCP 工具图标
1. 确认配置文件格式正确（JSON 语法）
2. 检查所有路径是否为绝对路径
3. 确保输出目录存在且可写
4. 完全退出并重启 Claude Desktop
5. 检查 Claude 日志：
   - macOS: `~/Library/Logs/Claude/mcp*.log`
   - Windows: `%APPDATA%\Claude\logs\mcp*.log`

#### 工具执行失败
1. 确保已正确安装 `mcp-svg-converter`
2. 检查输出目录的权限
3. 验证 SVG 代码是否有效
4. 检查 Claude 日志了解详细错误信息

#### "command not found" 错误
1. 确保已全局安装 `mcp-svg-converter` 或正确引用 `npx`
2. 确认 npm 的全局 bin 目录在系统 PATH 中
3. 尝试在配置中使用完整路径

### 调试

您可以使用 MCP Inspector 直接调试和测试服务器：

```bash
npx @modelcontextprotocol/inspector npx mcp-svg-converter /path/to/allowed/directory
```

这将打开一个交互式界面，你可以在其中测试所有可用工具，而无需通过 Claude Desktop。

### 安全考虑

- 服务器只会将文件写入启动服务器时指定的目录
- 如果用户尝试保存到非允许目录，文件将自动重定向到允许的目录
- 通过适当的路径验证防止路径遍历攻击

### 许可证

MIT
