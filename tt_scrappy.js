const puppeteer = require('puppeteer')
const html2json = require('html2json').html2json;
const fs = require("fs")

let url = "https://twitter.com/";
let usr_commandline = process.argv.slice(2);
let usr = usr_commandline;
let user_name = '';
let password = '';
data = {}

async function scrapp(url, usr, data) {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/chromium-browser',
		headless: false
	});
	const page = await browser.newPage();
	page.setViewport({
		width: 1366,
		height: 768
	});
	await get_home_data(page, url, usr, data);

	const navigationPromise = page.waitForNavigation();

	await page.goto(url + '/login');
	await page.waitForSelector('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input',{ timeout: 50000 });

	await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input', user_name);
	await page.type('#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input', password);

	await page.click('#page-container > div > div.signin-wrapper > form > div.clearfix > button');
	await navigationPromise;
	console.log("Logged");
	await page.waitForSelector('#choose-photo > a > div');
	//get followers
	await get_followers(page, url, usr);
	//get following
	await get_following(page, url, usr);
	// //get likes
	//await get_liked(page,url, usr);
	//get home pagee data 
	browser.close();
}

async function get_home_data(page, url, usr, data) {
	console.log('Getting home page');
	await page.goto(url + usr);
	let username = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > h1 > a").textContent;
	});
	console.log("get username");
	let bio = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > p").textContent;
	});
	console.log("get bio");
	let lcoation = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > div.ProfileHeaderCard-location > span.ProfileHeaderCard-locationText.u-dir").textContent.trim();
	});
	console.log("get location");

	let create_at = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size1of3.u-lg-size1of4 > div > div > div > div.ProfileHeaderCard > div.ProfileHeaderCard-joinDate > span.ProfileHeaderCard-joinDateText.js-tooltip.u-dir").textContent;
	});
	console.log("get created date");
	console.log("starting scrolling");
	loaded = false;
	actualPosition = 0;
	count = 0;
	while (!loaded) {
		if (count >= 1000) {
			break;
		}
		count += 1;
		console.log(count);
		console.log("loading...");
		const lastPosition = await scrollPageToBottom(page);
		console.log(actualPosition, lastPosition);

		if (lastPosition == actualPosition) {
			console.log("loaded");
			loaded = true;
		}
		actualPosition = lastPosition;

		let create_at = await page.evaluate(() => {
			value = document.querySelector("#timeline > div > div.stream > div.stream-footer > div > div.stream-end");
			if (value != null) {
				console.log("loaded");
				loaded = true;
			}

		});
	}
	let tweets = await page.evaluate(() => {
		return document.querySelector("#stream-items-id").innerHTML;
	});
	tweets = tweets.replace(/(\r\n|\n|\r)/gm, "");
	save("info_", usr, tweets, postfix = ".html");

	data = {
		name: username,
		bio: bio,
		lcoation: lcoation,
		create_at: create_at,
		tweets: {},
	};
	save("", usr, JSON.stringify(data), postfix = ".json");
}


function save(prefix, usr, data, postfix = ".json") {
	let fileName = [prefix, usr, postfix].join("");;
	fs.appendFile(fileName, data, function (err) {
		if (err) throw err;
	});
}

async function scrollPageToBottom(page, scrollStep = 3000, scrollDelay = 300) {
	const lastPosition = await page.evaluate(
		async (step, delay) => {
				const getScrollHeight = (element) => {
					const {
						scrollHeight,
						offsetHeight,
						clientHeight
					} = element
					return Math.max(scrollHeight, offsetHeight, clientHeight)
				}
				console.log("scrolling");
				const position = await new Promise((resolve) => {
					let count = 0
					const intervalId = setInterval(() => {
						const {
							body
						} = document
						const availableScrollHeight = getScrollHeight(body)

						window.scrollBy(0, step)
						count += step

						if (count >= availableScrollHeight) {
							clearInterval(intervalId)
							resolve(count)
						}
					}, delay)
				})

				return position
			},
			scrollStep,
			scrollDelay,
	)
	return lastPosition
}

async function get_following(page, url, usr) {
	console.log("Getting following");
	await page.goto(url + usr + "/following");
	await page.waitForSelector('#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div:nth-child(2) > div.GridTimeline');
	console.log("starting scrolling");
	loaded = false;
	actualPosition = 0;
	count = 0;
	while (!loaded) {
		if (count >= 1000) {
			break;
		}
		count += 1;
		console.log(count);
		console.log("loading...");
		const lastPosition = await scrollPageToBottom(page, scrollStep = 3000, scrollDelay = 1500);
		console.log(actualPosition, lastPosition);

		if (lastPosition == actualPosition) {
			console.log("loaded");
			loaded = true;
		}
		actualPosition = lastPosition;
	}
	let following = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div:nth-child(2) > div.GridTimeline").innerHTML;
	});
	save("following_", usr, following, postfix = ".html");
}
async function get_followers(page, url, usr, data) {
	console.log("Getting followers");
	await page.goto(url + usr + "/followers");
	console.log("starting scrolling");
	await page.waitForSelector('#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div:nth-child(2) > div.GridTimeline > div.GridTimeline-items.has-items');
	loaded = false;
	actualPosition = 0;
	count = 0;
	while (!loaded) {
		if (count >= 1000) {
			break;
		}
		count += 1;
		console.log(count);
		console.log("loading...");
		const lastPosition = await scrollPageToBottom(page, scrollStep = 3000, scrollDelay = 1500);
		console.log(actualPosition, lastPosition);

		if (lastPosition == actualPosition) {
			console.log("loaded");
			loaded = true;
		}
		actualPosition = lastPosition;
	}

	let followers = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div:nth-child(2) > div.GridTimeline > div.GridTimeline-items.has-items").innerHTML;
	});
	save("followers_", usr, followers, postfix = ".html");
}

async function get_liked(page, url, usr) {
	console.log("Getting likes");
	await page.goto(url + usr + "/likes");
	console.log("starting scrolling");
	await page.waitForSelector('#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div.Grid-cell.u-lg-size2of3');
	loaded = false;
	actualPosition = 0;
	count = 0;
	while (!loaded) {
		if (count >= 1000) {
			break;
		}
		count += 1;
		console.log(count);
		console.log("loading...");
		const lastPosition = await scrollPageToBottom(page);
		console.log(actualPosition, lastPosition);

		if (lastPosition == actualPosition) {
			console.log("loaded");
			loaded = true;
		}
		actualPosition = lastPosition;
	}
	let likes = await page.evaluate(() => {
		return document.querySelector("#page-container > div.AppContainer > div > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div.Grid-cell.u-lg-size2of3").innerHTML;
	});
	save("likes_", usr, likes, postfix = ".html");
}

//Start here
scrapp(url, usr, data);