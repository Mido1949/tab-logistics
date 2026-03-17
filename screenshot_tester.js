const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const artifactDir = 'C:\\Users\\Mido\\.gemini\\antigravity\\brain\\ee16e504-7780-4ce9-b93b-d1da773d5f44';
  const ts = Date.now();

  const takeShot = async (path, name) => {
    try {
        await page.goto(`http://localhost:3002${path}`, {waitUntil: 'networkidle2'});
        await page.screenshot({ path: `${artifactDir}\\${name}_new_${ts}.png`, fullPage: true });
        console.log(`Saved ${name}`);
    } catch (e) {
        console.error(`Failed ${name}:`, e.message);
    }
  };

  await page.setViewport({ width: 1280, height: 800 });
  await takeShot('/', 'home_page');
  await takeShot('/login', 'login_page');
  await takeShot('/dashboard', 'dashboard');
  await takeShot('/orders/add', 'orders_add');
  await takeShot('/orders/batch', 'orders_batch');
  await takeShot('/orders/list', 'orders_list');
  await takeShot('/orders/available', 'orders_available');

  await browser.close();
})();
