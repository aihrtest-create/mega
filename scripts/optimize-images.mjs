import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SRC_DIR = path.join(process.cwd(), 'src');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
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
  .filter(file => !file.includes('/cakes/'))
  .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

const srcFiles = getAllFiles(SRC_DIR).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.css'));

async function processImages() {
  const replacements = [];

  for (const pubFile of publicFiles) {
    const ext = path.extname(pubFile);
    const webpFile = pubFile.slice(0, -ext.length) + '.webp';
    
    const relativeOld = pubFile.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
    const relativeNew = webpFile.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
    
    try {
      await sharp(pubFile)
        .webp({ quality: 80 })
        .toFile(webpFile);
      
      fs.unlinkSync(pubFile);
      
      replacements.push({
        oldStr: relativeOld,
        newStr: relativeNew
      });
      console.log(`Converted ${relativeOld} to ${relativeNew}`);
    } catch (err) {
      console.error(`Error processing ${pubFile}:`, err);
    }
  }

  // Update source files
  let updatedCount = 0;
  for (const srcFile of srcFiles) {
    let content = fs.readFileSync(srcFile, 'utf8');
    let hasChanges = false;
    
    for (const r of replacements) {
      // Create a global replacement
      // we only want to replace the exact occurrences.
      if (content.includes(r.oldStr)) {
        content = content.split(r.oldStr).join(r.newStr);
        hasChanges = true;
      }
      
      // Sometimes it's referenced without leading slash, check just the basename
      const oldBase = path.basename(r.oldStr);
      const newBase = path.basename(r.newStr);
      // be very careful with replacing just basenames
      // check if it's imported in CSS or json, or hardcoded with some other prefix
      // we will just do global search and replace for the exact old path string or basename if it matches a strict pattern. 
      // Safest is to replace the relative path which starts with `/`
    }
    
    if (hasChanges) {
      fs.writeFileSync(srcFile, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} source files.`);
}

processImages().then(() => console.log('Done!'));
