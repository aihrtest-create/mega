import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const LOCATIONS_DIR = path.join(process.cwd(), 'public/locations');

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

const locationFiles = getAllFiles(LOCATIONS_DIR)
  .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

async function processImages() {
  for (const file of locationFiles) {
    const ext = path.extname(file);
    const webpFile = file.slice(0, -ext.length) + '.webp';
    
    try {
      // .rotate() auto-orients based on EXIF before stripping metadata
      await sharp(file)
        .rotate()
        .webp({ quality: 80 })
        .toFile(webpFile);
      
      fs.unlinkSync(file);
      console.log(`Fixed orientation for ${path.basename(file)}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages().then(() => console.log('Done fixing orientations!'));
