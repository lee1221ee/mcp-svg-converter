# MCP SVG Converter - Installation Guide

This guide explains how to install and use the MCP SVG Converter globally via npm.

## Global Installation

You can install this package globally to use it from anywhere on your system:

```bash
npm install -g mcp-svg-converter
```

Or use it directly with npx without installing:

```bash
npx mcp-svg-converter [output_directory1] [output_directory2] ...
```

## Usage After Global Installation

Once installed globally, you can run the server from anywhere:

```bash
mcp-svg-converter /path/to/output/directory
```

This will start the MCP server with permission to save files to the specified directory.

## Using with Claude Desktop

1. Install Claude Desktop from [claude.ai/download](https://claude.ai/download)

2. Configure Claude Desktop to use the globally installed MCP server:

   Edit your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   Add the following configuration:

   ```json
   {
     "mcpServers": {
       "svg-converter": {
         "command": "mcp-svg-converter",
         "args": [
           "/path/to/output/directory",
           "/other/allowed/directory"
         ]
       }
     }
   }
   ```

3. Restart Claude Desktop

4. Now you can convert SVGs by asking Claude:
   ```
   Please convert this SVG to PNG:
   
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
     <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
   </svg>
   ```

## Quick Usage with npx

Without installing globally, you can run the server directly with npx:

```bash
npx mcp-svg-converter /path/to/output/directory
```

To use with Claude Desktop, you would reference npx in the configuration:

```json
{
  "mcpServers": {
    "svg-converter": {
      "command": "npx",
      "args": [
        "mcp-svg-converter",
        "/path/to/output/directory"
      ]
    }
  }
}
```

## Troubleshooting

If you encounter permission issues:

- Make sure the output directories exist and are writable
- On Unix/Linux/macOS, you might need to use `sudo` for global installation
- Check the logs in Claude Desktop for any error messages

If you see "command not found" errors:

- Ensure npm's global bin directory is in your PATH
- Try using the full path to the package in Claude Desktop config:
  ```
  "command": "/usr/local/bin/mcp-svg-converter",  # Or your global npm bin path
  ```

## Using in a Project

To use as a dependency in another project:

```bash
npm install mcp-svg-converter
```

Then in your project:

```javascript
import { spawn } from 'child_process';

// Start the SVG Converter MCP server
const server = spawn('mcp-svg-converter', ['/path/to/output']);

// Communicate with the server using JSON-RPC over stdio
// ...
```
