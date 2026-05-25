import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SRC_DIR = path.join(process.cwd(), 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const publicFiles = getAllFiles(PUBLIC_DIR)
  .filter(file => !file.includes('/cakes/')) // Ignore cakes
  .filter(file => !file.endsWith('.DS_Store'));

const srcFiles = getAllFiles(SRC_DIR).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.css'));

const srcContents = srcFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

const unused = [];

for (const pubFile of publicFiles) {
  const relativePath = pubFile.replace(PUBLIC_DIR, '');
  const basename = path.basename(pubFile);
  
  // We check if the exact basename is present in the source files anywhere.
  // This is a naive but safe approach. If the basename is found, we consider it used.
  if (!srcContents.includes(basename)) {
    unused.push(relativePath);
  }
}

console.log('Unused files count:', unused.length);
console.log(unused.join('\n'));
