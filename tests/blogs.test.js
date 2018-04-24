const Page = require('./helpers/page');

let page;
/* eslint-disable no-undef */
beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});


describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Login to the app and get to new form creation page.', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('The form shows an error message.', async () => {
      const titleWarning = await page.getContentsOf('.title .red-text');
      const contentWarning = await page.getContentsOf('.content .red-text');
      expect(titleWarning).toEqual('You must provide a value');
      expect(contentWarning).toEqual('You must provide a value');
    });
  });

  describe('and using valid inputs', async () => {
    const blogTitle = 'mi titulo';
    const blogContent = 'mi contenido y eso';

    beforeEach(async () => {
      await page.type('.title input', blogTitle);
      await page.type('.content input', blogContent);
      await page.click('form button');
    });

    test('Submitting takes user to a review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submittng then saving add blog to blog index page.', async () => {
      await page.click('button.green');
      await page.waitFor('p');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual(blogTitle);
      expect(content).toEqual(blogContent);
    });
  });
});

describe('Not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My title',
        content: 'My content'
      }
    }
  ];
  test('blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    /* eslint-disable no-restricted-syntax */
    for (const result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});

/* eslint-enable no-undef */

