const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
                        executablePath: 'chromium-browser' // <- set path for chromium browser
  });
  const page = await browser.newPage();

  await page.goto('https://www.facebook.com',{timeout: 40000, waitUntil: 'domcontentloaded'});
  await page.pdf({path: 'hn.pdf', format: 'A4'});
  
  await browser.close();
})();