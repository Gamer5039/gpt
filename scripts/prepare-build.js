import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create public/prompt directory if it doesn't exist
const publicPromptDir = path.join(__dirname, '..', 'public', 'prompt');
if (!fs.existsSync(publicPromptDir)) {
  fs.mkdirSync(publicPromptDir, { recursive: true });
}

// Copy prompt files
const promptFiles = ['RRGPT prompt.txt', 'DAN prompt.txt'];
const sourceDir = path.join(__dirname, '..', 'prompt');
const targetDir = publicPromptDir;

promptFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to public/prompt/`);
  } else {
    console.error(`Warning: ${file} not found in prompt directory`);
  }
}); 