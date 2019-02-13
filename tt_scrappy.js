const puppeteer = require("puppeteer")
const fs = require("fs")

let url = "";
(async () => {
	const browser = await puppeteer.launch({executablePath:  'chromium-browser',headless: true});
	const page = await browser.newPage();
	await page.goto(url);
	console.log("browser open");
	let nome = await page.evaluate(()=>{ return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > h1 > a").textContent;});
	let bio = await page.evaluate(()=>{ return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > p").textContent;});
	let city = await page.evaluate(()=>{ return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > div.ProfileHeaderCard-location > span.ProfileHeaderCard-locationText.u-dir").textContent;
	});
	let tweets	= await page.evaluate(() => {
		return document.querySelector("#stream-items-id").innerHTML;
	});
	fs.appendFile('tweets.html', tweets, function (err) {
		  if (err) throw err;
		    console.log('Updated!');
	});
	data = {
		name: nome,
		bio:bio,
		city: city,
		tweets: tweet,
	
	};
	browser.close();
	}
)();
