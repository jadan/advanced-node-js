const Page = require('./helpers/page');

/* eslint-disable no-undef */
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
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
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});
