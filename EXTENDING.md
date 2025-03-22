# Extending SVG Converter MCP Server

This guide provides information on how to extend and modify the SVG Converter MCP Server for developers who want to add new features or customize its behavior.

## Architecture Overview

The SVG Converter MCP Server is built using TypeScript and follows a modular architecture:

- `src/index.ts` - Main entry point and MCP server setup
- `src/converter.ts` - Core SVG conversion logic using Sharp and JSDOM

The server leverages the Model Context Protocol to expose SVG conversion functionality as tools that Claude and other MCP clients can use.

## Adding New Conversion Formats

To add support for a new output format (e.g., WebP, AVIF):

1. Add a new conversion function in `src/converter.ts`:

```typescript
export async function convertSvgToWebP(
  svgCode: string,
  outputPath: string,
  backgroundColor?: string,
  quality = 80,
  scale = 1
): Promise<ConversionResult> {
  // Extract dimensions
  const { width, height } = extractSvgDimensions(svgCode);
  
  // Calculate scaled dimensions
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);
  
  // Convert using Sharp
  const buffer = Buffer.from(svgCode);
  
  const sharpInstance = sharp(buffer, { density: 96 * scale });
  
  // Apply background if provided
  if (backgroundColor) {
    sharpInstance.flatten({ background: backgroundColor });
  }
  
  // Apply dimensions
  sharpInstance.resize({
    width: scaledWidth,
    height: scaledHeight,
    fit: 'contain',
    background: backgroundColor ? backgroundColor : { r: 0, g: 0, b: 0, alpha: 0 }
  });
  
  // Save to file
  await sharpInstance.webp({ quality }).toFile(outputPath);
  
  // Get file size
  const stats = await fs.stat(outputPath);
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    size: stats.size
  };
}
```

2. Add a new tool definition in `src/index.ts`:

```typescript
// SVG to WebP conversion tool
server.tool(
  "svg-to-webp",
  "Convert SVG to WebP with high quality and resolution preservation",
  {
    svgCode: z.string().describe("The SVG code to convert"),
    outputPath: z.string().describe("The path where the WebP file should be saved"),
    backgroundColor: z.string().optional().describe("Optional background color (default: transparent)"),
    quality: z.number().min(1).max(100).optional().describe("Optional WebP quality from 1-100 (default: 80)"),
    scale: z.number().optional().describe("Optional scale factor for higher resolution (default: 1)"),
  },
  async ({ svgCode, outputPath, backgroundColor, quality, scale }) => {
    try {
      // Get a safe path that's allowed
      const safePath = getSafePath(outputPath);
      
      // Create directory if needed
      await ensureDirectory(safePath);
      
      // Convert the SVG
      const result = await convertSvgToWebP(svgCode, safePath, backgroundColor, quality, scale);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully converted SVG to WebP at ${safePath}\nDimensions: ${result.width}x${result.height} pixels\nFile size: ${result.size} bytes\nQuality: ${quality || 80}%`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error converting SVG to WebP: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);
```

## Adding Batch Processing

To add batch processing capabilities:

1. Create a new batch processing function in `src/converter.ts`:

```typescript
export async function batchConvertSvgs(
  svgFiles: Array<{svgCode: string, outputPath: string}>,
  format: 'png' | 'jpg' | 'webp',
  options: {
    backgroundColor?: string,
    quality?: number,
    scale?: number
  }
): Promise<Array<{outputPath: string, result: ConversionResult}>> {
  const results = [];
  
  for (const file of svgFiles) {
    try {
      let result;
      
      switch (format) {
        case 'png':
          result = await convertSvgToPng(
            file.svgCode, 
            file.outputPath,
            options.backgroundColor,
            options.scale
          );
          break;
        case 'jpg':
          result = await convertSvgToJpg(
            file.svgCode, 
            file.outputPath,
            options.backgroundColor, 
            options.quality,
            options.scale
          );
          break;
        case 'webp':
          result = await convertSvgToWebP(
            file.svgCode, 
            file.outputPath,
            options.backgroundColor, 
            options.quality,
            options.scale
          );
          break;
      }
      
      results.push({
        outputPath: file.outputPath,
        result
      });
    } catch (error) {
      // Log error but continue with other files
      console.error(`Error processing ${file.outputPath}:`, error);
      results.push({
        outputPath: file.outputPath,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  return results;
}
```

2. Add a new batch conversion tool in `src/index.ts`:

```typescript
// Batch SVG conversion tool
server.tool(
  "batch-convert",
  "Convert multiple SVGs to PNG, JPG, or WebP format",
  {
    svgFiles: z.array(z.object({
      svgCode: z.string().describe("The SVG code to convert"),
      outputPath: z.string().describe("The path where the file should be saved")
    })).describe("Array of SVG files to convert"),
    format: z.enum(['png', 'jpg', 'webp']).describe("Output format"),
    backgroundColor: z.string().optional().describe("Optional background color"),
    quality: z.number().min(1).max(100).optional().describe("Optional quality for JPG/WebP (default: depends on format)"),
    scale: z.number().optional().describe("Optional scale factor for higher resolution (default: 1)")
  },
  async ({ svgFiles, format, backgroundColor, quality, scale }) => {
    try {
      // Process each file, ensuring paths are safe
      const processedFiles = svgFiles.map(file => ({
        svgCode: file.svgCode,
        outputPath: getSafePath(file.outputPath)
      }));
      
      // Create directories for all output paths
      for (const file of processedFiles) {
        await ensureDirectory(file.outputPath);
      }
      
      // Perform batch conversion
      const results = await batchConvertSvgs(
        processedFiles,
        format,
        { backgroundColor, quality, scale }
      );
      
      // Format the results
      const successCount = results.filter(r => !r.error).length;
      const failureCount = results.length - successCount;
      
      return {
        content: [
          {
            type: "text",
            text: `Batch conversion complete.\nSuccessfully converted: ${successCount}\nFailed: ${failureCount}\n\nDetails:\n${
              results.map(r => r.error 
                ? `❌ ${r.outputPath}: ${r.error}`
                : `✅ ${r.outputPath}: ${r.result.width}x${r.result.height} pixels, ${r.result.size} bytes`
              ).join('\n')
            }`
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error in batch conversion: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);
```

## Custom SVG Processing

To add custom SVG processing before conversion:

1. Create processing functions in `src/converter.ts`:

```typescript
export function optimizeSvg(svgCode: string): string {
  // Use SVGO or other libraries to optimize the SVG
  // Example implementation (would need SVGO installed)
  // const result = svgo.optimize(svgCode, { multipass: true });
  // return result.data;
  
  // For now, just return the original code
  return svgCode;
}

export function applySvgTransformations(
  svgCode: string, 
  options: {
    width?: number,
    height?: number,
    removeText?: boolean,
    grayscale?: boolean
  }
): string {
  const dom = new JSDOM(`<!DOCTYPE html><body>${svgCode}</body>`);
  const svg = dom.window.document.querySelector("svg");
  
  if (!svg) {
    throw new Error("Invalid SVG: No SVG element found");
  }
  
  // Apply transformations based on options
  if (options.width && options.height) {
    svg.setAttribute("width", String(options.width));
    svg.setAttribute("height", String(options.height));
    svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
  }
  
  if (options.removeText) {
    const textElements = svg.querySelectorAll("text");
    textElements.forEach(el => el.remove());
  }
  
  if (options.grayscale) {
    // Add a grayscale filter definition
    const defs = dom.window.document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="grayscale">
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0"/>
      </filter>
    `;
    svg.prepend(defs);
    
    // Apply the filter to the entire SVG
    svg.setAttribute("style", "filter: url(#grayscale)");
  }
  
  return dom.window.document.body.innerHTML;
}
```

2. Add a transformation tool in `src/index.ts`:

```typescript
// SVG transformation tool
server.tool(
  "transform-svg",
  "Apply transformations to SVG before converting",
  {
    svgCode: z.string().describe("The SVG code to transform"),
    outputPath: z.string().describe("The path where to save the transformed SVG"),
    width: z.number().optional().describe("Optional new width"),
    height: z.number().optional().describe("Optional new height"),
    removeText: z.boolean().optional().describe("Remove text elements"),
    grayscale: z.boolean().optional().describe("Convert to grayscale"),
    optimize: z.boolean().optional().describe("Optimize SVG code")
  },
  async ({ svgCode, outputPath, width, height, removeText, grayscale, optimize }) => {
    try {
      // Get a safe path that's allowed
      const safePath = getSafePath(outputPath);
      
      // Create directory if needed
      await ensureDirectory(safePath);
      
      // Apply transformations
      let transformedSvg = svgCode;
      
      if (width || height || removeText || grayscale) {
        transformedSvg = applySvgTransformations(transformedSvg, {
          width,
          height,
          removeText,
          grayscale
        });
      }
      
      if (optimize) {
        transformedSvg = optimizeSvg(transformedSvg);
      }
      
      // Save the transformed SVG
      await fs.writeFile(safePath, transformedSvg, 'utf8');
      
      // Get file size
      const stats = await fs.stat(safePath);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully transformed SVG and saved to ${safePath}\nFile size: ${stats.size} bytes\nTransformations applied: ${
              [
                width && height ? `resized to ${width}x${height}` : null,
                removeText ? "removed text elements" : null,
                grayscale ? "converted to grayscale" : null,
                optimize ? "optimized code" : null
              ].filter(Boolean).join(", ")
            }`
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error transforming SVG: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);
```

## Advanced Configuration

To add advanced configuration options:

1. Create a configuration interface in a new file `src/config.ts`:

```typescript
export interface ServerConfig {
  // Server settings
  name: string;
  version: string;
  
  // Security settings
  defaultAllowedDirs: string[];
  maxFileSize: number;
  
  // Conversion settings
  defaultScale: number;
  defaultJpgQuality: number;
  defaultWebpQuality: number;
  defaultBackgroundColor: string;
  
  // Performance settings
  concurrentConversions: number;
}

// Default configuration
export const defaultConfig: ServerConfig = {
  name: "svg-converter",
  version: "1.0.6",
  
  defaultAllowedDirs: [],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  defaultScale: 1,
  defaultJpgQuality: 90,
  defaultWebpQuality: 80,
  defaultBackgroundColor: "transparent",
  
  concurrentConversions: 2
};

// Load configuration from file or environment
export function loadConfig(): ServerConfig {
  const config = { ...defaultConfig };
  
  // Override from environment variables if present
  if (process.env.SVG_CONVERTER_NAME) config.name = process.env.SVG_CONVERTER_NAME;
  if (process.env.SVG_CONVERTER_VERSION) config.version = process.env.SVG_CONVERTER_VERSION;
  
  if (process.env.SVG_MAX_FILE_SIZE) 
    config.maxFileSize = parseInt(process.env.SVG_MAX_FILE_SIZE, 10);
  
  if (process.env.SVG_DEFAULT_SCALE) 
    config.defaultScale = parseFloat(process.env.SVG_DEFAULT_SCALE);
  
  if (process.env.SVG_DEFAULT_JPG_QUALITY) 
    config.defaultJpgQuality = parseInt(process.env.SVG_DEFAULT_JPG_QUALITY, 10);
  
  if (process.env.SVG_DEFAULT_WEBP_QUALITY) 
    config.defaultWebpQuality = parseInt(process.env.SVG_DEFAULT_WEBP_QUALITY, 10);
  
  if (process.env.SVG_DEFAULT_BG_COLOR) 
    config.defaultBackgroundColor = process.env.SVG_DEFAULT_BG_COLOR;
  
  if (process.env.SVG_CONCURRENT_CONVERSIONS) 
    config.concurrentConversions = parseInt(process.env.SVG_CONCURRENT_CONVERSIONS, 10);
  
  return config;
}
```

2. Modify `src/index.ts` to use the configuration:

```typescript
import { loadConfig } from "./config.js";

// Load configuration
const config = loadConfig();

// Create server instance with config
const server = new McpServer({
  name: config.name,
  version: config.version,
});

// Use configuration values in tools
// ...
```

## Testing Your Extensions

After implementing new features:

1. Build the project:
   ```bash
   npm run build
   ```

2. Test with the MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector node build/index.js /path/to/output/directory
   ```

3. Update tests and documentation to reflect your new features.

## Contributing Back

If you've created useful extensions, consider:

1. Submitting a pull request to the main repository
2. Sharing your code as an extension or plugin
3. Writing a guide about your customizations

## Resources for Developers

- [Sharp Documentation](https://sharp.pixelplumbing.com/) - For image processing
- [JSDOM Documentation](https://github.com/jsdom/jsdom) - For SVG parsing and manipulation
- [Model Context Protocol Specification](https://modelcontextprotocol.io/docs/concepts/architecture) - For MCP details
