const puppeteer = require("puppeteer")
const html2json = require('html2json').html2json;
const fs = require("fs")

let url = "https://twitter.com/";
let usr_commandline = process.argv.slice(2);
let usr = usr_commandline;
(async () => {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/chromium-browser',
		headless: true
	});
	const page = await browser.newPage();
	await page.goto(url + usr);
	page.setViewport({ width: 1280, height: 926 });
	let nome = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > h1 > a").textContent;
	});
	let bio = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > p").textContent;
	});
	let city = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > div.ProfileHeaderCard-location > span.ProfileHeaderCard-locationText.u-dir").textContent.trim();
	});

	let create_at = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > div.ProfileHeaderCard-joinDate > span.ProfileHeaderCard-joinDateText.js-tooltip.u-dir").textContent;
	});
	let tweets = await page.evaluate(() => {
		return document.querySelector("#stream-items-id").innerHTML;
	});
	tweets = tweets.replace(/(\r\n|\n|\r)/gm, "");
	save("info_",usr, tweets, postfix = ".html");

	data = {
		name: nome,
		bio: bio,
		city: city,
		create_at: create_at,
		tweets: {},
	};
	save("",usr, JSON.stringify(data), postfix = ".json");
	browser.close();	
})();

function save(prefix,usr, data, postfix = ".json") {
	let fileName = [prefix, usr, postfix].join("");;
	fs.appendFile(fileName, data, function (err) {
		if (err) throw err;
	});
}