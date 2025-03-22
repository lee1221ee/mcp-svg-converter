import fs from 'fs';
import path from 'path';
import { convertSvgToPng, convertSvgToJpg } from './converter.js';

async function runTest() {
  try {
    // Read example SVG
    const svgCode = fs.readFileSync(path.resolve(process.cwd(), 'example.svg'), 'utf8');
    
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(process.cwd(), 'test-output');
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
  }
}

runTest();
