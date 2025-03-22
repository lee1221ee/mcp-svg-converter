#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the example SVG
const svgPath = path.join(__dirname, 'example.svg');
const svgCode = fs.readFileSync(svgPath, 'utf8');

// Output directory
const outputDir = path.join(__dirname, 'output');
fs.mkdirSync(outputDir, { recursive: true });

// Output paths
const pngOutputPath = path.join(outputDir, 'example.png');
const jpgOutputPath = path.join(outputDir, 'example.jpg');

// Function to call the MCP server programmatically
async function callMcpServer(toolName, params) {
  return new Promise((resolve, reject) => {
    // Adjust the path to your MCP server build
    const serverPath = path.join(__dirname, '..', 'build', 'index.js');
    
    // Start the MCP server process, allowing access to the output directory
    const serverProcess = spawn('node', [serverPath, outputDir]);
    
    let stdoutData = '';
    let stderrData = '';
    
    serverProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    serverProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    // Prepare the MCP tool call in JSON-RPC format
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };
    
    // Write the request to the server's stdin
    serverProcess.stdin.write(JSON.stringify(request) + '\n');
    serverProcess.stdin.end();
    
    serverProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Server process exited with code ${code}`);
        console.error('STDERR:', stderrData);
        reject(new Error(`Server process exited with code ${code}`));
        return;
      }
      
      try {
        // Parse the response from stdout
        const lines = stdoutData.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const response = JSON.parse(lastLine);
        
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      } catch (err) {
        console.error('Failed to parse server response:', err);
        console.error('STDOUT:', stdoutData);
        reject(err);
      }
    });
  });
}

// Main function
async function main() {
  try {
    console.log('Converting SVG to PNG...');
    const pngResult = await callMcpServer('svg-to-png', {
      svgCode,
      outputPath: pngOutputPath,
      scale: 2
    });
    console.log('PNG conversion result:', pngResult);
    
    console.log('\nConverting SVG to JPG...');
    const jpgResult = await callMcpServer('svg-to-jpg', {
      svgCode,
      outputPath: jpgOutputPath,
      quality: 95,
      backgroundColor: '#ffffff'
    });
    console.log('JPG conversion result:', jpgResult);
    
    console.log('\nConversion complete! Check the output directory.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
