# SVG Converter MCP Examples

This directory contains examples to help you get started with the SVG Converter MCP server.

## Contents

- `example.svg` - A sample SVG file you can use for testing
- `claude-prompt-example.txt` - Example prompts to use with Claude Desktop
- `api-example.js` - Example Node.js script showing how to interact with the MCP server programmatically
- `config-examples/` - Example configuration files for Claude Desktop on different platforms

## Using the Examples

### Claude Desktop Integration

1. First, make sure you've built the MCP server:
   ```bash
   cd ..
   npm run build
   ```

2. Copy the appropriate configuration example from `config-examples/` to your Claude Desktop configuration location:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Update the paths in the configuration file to match your actual file paths.

4. Create the output directory if it doesn't exist:
   ```bash
   mkdir -p ~/Desktop/svg-output  # macOS
   # or
   mkdir "%USERPROFILE%\Desktop\svg-output"  # Windows
   ```

5. Restart Claude Desktop.

6. Copy the content from `claude-prompt-example.txt` and paste it into a Claude Desktop chat.

### Programmatic API Example

The `api-example.js` script shows how to interact with the MCP server programmatically:

1. Ensure you have built the MCP server.

2. Run the example script:
   ```bash
   node api-example.js
   ```

3. Check the `examples/output/` directory for the generated PNG and JPG files.

## Notes

- The server must have permission to write to the output directories specified in your configuration.
- The SVG converter maintains the original aspect ratio of your SVG when converting to PNG or JPG.
- You can customize conversion parameters like scale, quality, and background color.
