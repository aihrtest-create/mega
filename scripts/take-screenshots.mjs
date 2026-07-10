import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const publicDir = path.join(__dirname, '..', 'public', 'screenshots');
  if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Splash Page
  await page.goto('http://localhost:5173/mega/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(publicDir, '1-splash.png') });

  // 2. Base Package Step
  const startBtn = await page.$('button'); // Assume 'Start Building' is the main button
  if (startBtn) {
    await startBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(publicDir, '2-base-package.png') });
  }

  // Click Base Package card to select one (e.g., standard)
  const cards = await page.$$('.cursor-pointer');
  if (cards.length > 0) {
    await cards[0].click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(publicDir, '3-package-selected.png') });
    
    // Click Next
    const nextBtn = await page.$('button:has-text("Next")') || await page.$('button.bg-primary');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(publicDir, '4-guests.png') });
    }
  }

  await browser.close();
}

captureScreenshots().catch(console.error);
