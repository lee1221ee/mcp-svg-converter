# SVG Converter MCP Server

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

#### Prerequisites

- Node.js 16 or higher
- npm or yarn

#### Installation Steps

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

1. Install [Claude Desktop](https://claude.ai/download)
2. Create or edit the Claude configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Add this server configuration:
   ```json
   {
     "mcpServers": {
       "svg-converter": {
         "command": "node",
         "args": [
           "/absolute/path/to/mcp-svg-converter/build/index.js",
           "/path/to/allowed/output/directory",
           "/path/to/other/allowed/directory"
         ]
       }
     }
   }
   ```

4. Restart Claude Desktop

5. In Claude Desktop, you can now ask for SVG conversions:
   ```
   Please convert this SVG to PNG and save it to my desktop:
   
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
     <rect x="10" y="10" width="80" height="80" fill="#4285f4" />
     <circle cx="140" cy="50" r="40" fill="#ea4335" />
     <path d="M10 50 L90 50 L50 90 Z" fill="#fbbc05" />
     <text x="100" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="#34a853">SVG Example</text>
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

### Debugging

You can use the MCP Inspector to debug and test the server directly:

```bash
npx @modelcontextprotocol/inspector node /path/to/mcp-svg-converter/build/index.js /path/to/allowed/directory
```

### Security Considerations

- The server will only write files to the directories specified when starting the server
- If a user attempts to save to a non-allowed directory, the file will be automatically redirected to an allowed directory
- Path traversal attacks are prevented by proper path validation

### License

MIT

---

<a name="中文"></a>
## 中文

一个提供 SVG 代码转换为高质量 PNG 和 JPG 图像工具的模型上下文协议 (MCP) 服务器，支持详细的自定义选项。

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

#### 前提条件

- Node.js 16 或更高版本
- npm 或 yarn

#### 安装步骤

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

1. 安装 [Claude Desktop](https://claude.ai/download)
2. 创建或编辑 Claude 配置文件：
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. 添加此服务器配置：
   ```json
   {
     "mcpServers": {
       "svg-converter": {
         "command": "node",
         "args": [
           "/absolute/path/to/mcp-svg-converter/build/index.js",
           "/path/to/allowed/output/directory",
           "/path/to/other/allowed/directory"
         ]
       }
     }
   }
   ```

4. 重启 Claude Desktop

5. 在 Claude Desktop 中，现在可以请求 SVG 转换：
   ```
   请将这个 SVG 转换为 PNG 并保存到我的桌面：
   
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
     <rect x="10" y="10" width="80" height="80" fill="#4285f4" />
     <circle cx="140" cy="50" r="40" fill="#ea4335" />
     <path d="M10 50 L90 50 L50 90 Z" fill="#fbbc05" />
     <text x="100" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="#34a853">SVG 示例</text>
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

### 调试

您可以使用 MCP Inspector 直接调试和测试服务器：

```bash
npx @modelcontextprotocol/inspector node /path/to/mcp-svg-converter/build/index.js /path/to/allowed/directory
```

### 安全考虑

- 服务器只会将文件写入启动服务器时指定的目录
- 如果用户尝试保存到非允许目录，文件将自动重定向到允许的目录
- 通过适当的路径验证防止路径遍历攻击

### 许可证

MIT
