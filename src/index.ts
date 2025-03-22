#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "path";
import fs from "fs-extra";
import { convertSvgToPng, convertSvgToJpg } from "./converter.js";

// Get the allowed directories from command line arguments
const allowedDirs = process.argv.slice(2);

if (allowedDirs.length === 0) {
  console.error("Error: You must specify at least one allowed directory.");
  console.error("Usage: mcp-svg-converter <allowed_dir1> [allowed_dir2] ...");
  process.exit(1);
}

// Make sure all directories exist and are accessible
for (const dir of allowedDirs) {
  try {
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      console.error(`Error: ${dir} is not a directory.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error accessing directory ${dir}: ${err instanceof Error ? err.message : String(err)}`);
    console.error("If the directory doesn't exist, please create it first.");
    process.exit(1);
  }
}

console.error(`SVG Converter MCP Server starting...`);
console.error(`Allowed directories: ${allowedDirs.join(", ")}`);

// Create server instance
const server = new McpServer({
  name: "svg-converter",
  version: "1.0.6",
});

// Validate if a path is within allowed directories
function isPathAllowed(filePath: string): boolean {
  const resolvedPath = path.resolve(filePath);
  return allowedDirs.some(dir => {
    const resolvedDir = path.resolve(dir);
    return resolvedPath === resolvedDir || resolvedPath.startsWith(resolvedDir + path.sep);
  });
}

// Get safe path - redirects to allowed directory if needed
function getSafePath(outputPath: string): string {
  // Check if path is already allowed
  if (isPathAllowed(outputPath)) {
    return outputPath;
  }
  
  // If not allowed, try to redirect to first allowed directory
  // 1. Try to keep the subdirectory structure if possible
  for (const allowedDir of allowedDirs) {
    // See if we can simply replace a base path with an allowed path
    const relPath = path.relative('/Users', outputPath);
    if (relPath && !relPath.startsWith('..')) {
      const newPath = path.join(allowedDir, path.basename(outputPath));
      console.error(`Redirecting: ${outputPath} -> ${newPath}`);
      return newPath;
    }
  }
  
  // 2. Fallback - just use filename in first allowed dir
  const fileName = path.basename(outputPath);
  const newPath = path.join(allowedDirs[0], fileName);
  console.error(`Redirecting: ${outputPath} -> ${newPath}`);
  return newPath;
}

// Ensure directory exists
async function ensureDirectory(outputPath: string): Promise<void> {
  const dir = path.dirname(outputPath);
  await fs.ensureDir(dir);
}

// SVG to PNG conversion tool
server.tool(
  "svg-to-png",
  "Convert SVG to PNG with high quality and resolution preservation",
  {
    svgCode: z.string().describe("The SVG code to convert"),
    outputPath: z.string().describe("The path where the PNG file should be saved"),
    backgroundColor: z.string().optional().describe("Optional background color (default: transparent)"),
    scale: z.number().optional().describe("Optional scale factor for higher resolution (default: 1)"),
  },
  async ({ svgCode, outputPath, backgroundColor, scale }) => {
    try {
      // Get a safe path that's allowed
      const safePath = getSafePath(outputPath);
      
      // Create directory if needed
      await ensureDirectory(safePath);
      
      // Convert the SVG
      const result = await convertSvgToPng(svgCode, safePath, backgroundColor, scale);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully converted SVG to PNG at ${safePath}\nDimensions: ${result.width}x${result.height} pixels\nFile size: ${result.size} bytes`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error converting SVG to PNG: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// SVG to JPG conversion tool
server.tool(
  "svg-to-jpg",
  "Convert SVG to JPG with high quality and resolution preservation",
  {
    svgCode: z.string().describe("The SVG code to convert"),
    outputPath: z.string().describe("The path where the JPG file should be saved"),
    backgroundColor: z.string().optional().describe("Optional background color (default: white)"),
    quality: z.number().min(1).max(100).optional().describe("Optional JPEG quality from 1-100 (default: 90)"),
    scale: z.number().optional().describe("Optional scale factor for higher resolution (default: 1)"),
  },
  async ({ svgCode, outputPath, backgroundColor, quality, scale }) => {
    try {
      // Get a safe path that's allowed
      const safePath = getSafePath(outputPath);
      
      // Create directory if needed
      await ensureDirectory(safePath);
      
      // Convert the SVG
      const result = await convertSvgToJpg(svgCode, safePath, backgroundColor, quality, scale);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully converted SVG to JPG at ${safePath}\nDimensions: ${result.width}x${result.height} pixels\nFile size: ${result.size} bytes\nQuality: ${quality || 90}%`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error converting SVG to JPG: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("SVG Converter MCP Server running...");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main().catch(console.error);
