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
    await this.page.goto('localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    const text = await this.page.$eval(selector, el => el.innerHTML);
    return text;
  }

  get(path) {
    return this.page.evaluate(_path =>
      fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()), path);
  }

  post(path, data) {
    return this.page.evaluate((_path, _data) =>
      fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      }).then(res => res.json()), path, data);
  }

  execRequests(actions) {
    return Promise.all(actions.map(({ method, path, data }) =>
      this[method](path, data)));
  }
}

module.exports = Page;
