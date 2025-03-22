import sharp from "sharp";
import { JSDOM } from "jsdom";
import fs from "fs-extra";

interface ConversionResult {
  width: number;
  height: number;
  size: number;
}

/**
 * Extract dimensions from SVG code
 */
function extractSvgDimensions(svgCode: string): { width: number; height: number } {
  // Create a DOM parser
  const dom = new JSDOM(`<!DOCTYPE html><body>${svgCode}</body>`);
  const svg = dom.window.document.querySelector("svg");
  
  if (!svg) {
    throw new Error("Invalid SVG: No SVG element found");
  }
  
  // Try to get dimensions from viewBox first
  let width = 0;
  let height = 0;
  
  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const [, , w, h] = viewBox.split(/\s+/).map(parseFloat);
    width = w;
    height = h;
  }
  
  // If viewBox doesn't exist or is invalid, try width/height attributes
  if (!width || !height) {
    const widthAttr = svg.getAttribute("width");
    const heightAttr = svg.getAttribute("height");
    
    if (widthAttr) {
      width = parseFloat(widthAttr);
    }
    
    if (heightAttr) {
      height = parseFloat(heightAttr);
    }
  }
  
  // Default dimensions if nothing is specified
  if (!width || !height) {
    width = 300;
    height = 150;
  }
  
  return { width, height };
}

/**
 * Convert SVG to PNG
 */
export async function convertSvgToPng(
  svgCode: string,
  outputPath: string,
  backgroundColor?: string,
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
  
  if (backgroundColor) {
    sharpInstance.flatten({ background: backgroundColor });
  }
  
  // Apply dimensions
  sharpInstance.resize({
    width: scaledWidth,
    height: scaledHeight,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  });
  
  // Save to file
  await sharpInstance.png().toFile(outputPath);
  
  // Get file size
  const stats = await fs.stat(outputPath);
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    size: stats.size
  };
}

/**
 * Convert SVG to JPG
 */
export async function convertSvgToJpg(
  svgCode: string,
  outputPath: string,
  backgroundColor = "#ffffff",
  quality = 90,
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
  
  // JPGs don't support transparency, so we need a background
  sharpInstance.flatten({ background: backgroundColor || "#ffffff" });
  
  // Apply dimensions
  sharpInstance.resize({
    width: scaledWidth,
    height: scaledHeight,
    fit: 'contain',
    background: backgroundColor || "#ffffff"
  });
  
  // Save to file
  await sharpInstance.jpeg({ quality: quality || 90 }).toFile(outputPath);
  
  // Get file size
  const stats = await fs.stat(outputPath);
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    size: stats.size
  };
}
