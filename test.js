#!/usr/bin/env node

// Simple test script to verify the CLI works
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

console.log('Testing SD Coding Standards CLI...');

// Check if templates directory has all required files
const templatesDir = path.join(__dirname, 'templates');
const requiredFiles = [
  '.eslintrc.js',
  '.prettierrc.js',
  'tsconfig.json',
  'postcss.config.js',
  'tailwind.config.js'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(templatesDir, file)));

if (missingFiles.length > 0) {
  console.error(`Error: Missing template files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ All template files present');

// Check if bin file is executable
try {
  fs.accessSync(path.join(__dirname, 'bin', 'index.js'), fs.constants.X_OK);
  console.log('✅ CLI script is executable');
} catch (error) {
  console.error('Error: CLI script is not executable');
  console.log('Making CLI script executable...');
  try {
    execSync('chmod +x ./bin/index.js', { cwd: __dirname });
    console.log('✅ CLI script is now executable');
  } catch (error) {
    console.error(`Error making CLI script executable: ${error.message}`);
  }
}

console.log('✅ Test completed successfully');
