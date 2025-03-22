#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertSvgToPng, convertSvgToJpg } from './build/converter.js';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTest() {
  try {
    // Read example SVG
    const svgCode = fs.readFileSync(path.resolve(__dirname, 'example.svg'), 'utf8');
    
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, 'test-output');
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Test PNG conversion
    console.log('Testing PNG conversion...');
    const pngResult = await convertSvgToPng(
      svgCode,
      path.join(outputDir, 'example.png'),
      undefined,
      2
    );
    console.log('PNG conversion result:', pngResult);
    
    // Test JPG conversion
    console.log('Testing JPG conversion...');
    const jpgResult = await convertSvgToJpg(
      svgCode,
      path.join(outputDir, 'example.jpg'),
      '#ffffff',
      95,
      2
    );
    console.log('JPG conversion result:', jpgResult);
    
    console.log('Tests completed successfully!');
    console.log(`Output files can be found in: ${outputDir}`);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTest();
