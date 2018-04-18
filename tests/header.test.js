
const puppeteer = require('puppeteer');
const { Buffer } = require('safe-buffer');
const Keygrip = require('keygrip');

const keys = require('../config/keys');

/* eslint-disable no-undef */
let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('Launch chromium', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('Clicking launches oauth', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button.', async () => {
  const id = '5ad0eb1d4bec083945e8ab3c';
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer
    .from(JSON.stringify(sessionObject))
    .toString('base64');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign(`session=${sessionString}`);
  console.log(sessionString, sig);
});
