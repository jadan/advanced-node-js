const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const redis = require('redis');
const util = require('util');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);
    // Check cache for query. If yes respond, else store data
    // in the cache.
    // Callback hack (promisify).
    client.get = util.promisify(client.get);
    const cachedBlogs = await client.get(req.user.id);
    if (cachedBlogs) {
      console.log('Serving from cache.');
      console.log(JSON.parse(cachedBlogs));
      return res.send(JSON.parse(cachedBlogs));
    }
    const blogs = await Blog.find({ _user: req.user.id });
    console.log('Serving from MongoDB.');
    client.set(req.user.id, JSON.stringify(blogs));
    return res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
