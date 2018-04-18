const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    const customPage = new Page(page);
    return new Proxy(customPage, {
      /* eslint-disable */
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
      /* eslint-enable */
    });
  }
  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000');
    await this.page.waitFor('a[href="/auth/logout"]');
  }
}

module.exports = Page;
