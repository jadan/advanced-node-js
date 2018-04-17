const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const { exec } = mongoose.Query.prototype;
// Setup REDIS + promisify get function
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

// REMINDER https://bit.ly/2qEmUkN
// Arrow function vs function declaration / expressions:
// Are they equivalent / exchangeable?
// Arrow functions and function declarations / expressions
// are not equivalent and cannot be replaced blindly.
// If the function you want to replace does not use this,
// arguments and is not called with new, then yes.

mongoose.Query.prototype.cache = function cache() {
  // this equals query instance
  this.useCache = true;
  // return makes it chainable
  return this;
};

mongoose.Query.prototype.exec = async function execAndCache(...args) {
  if (!this.useCache) {
    return exec.apply(this, args);
  }
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));
  // Search cache.
  const cachedValue = await client.get(key);
  if (cachedValue) {
    // Function expects to return a Mongoose object.
    // Mongoose model with properties like get, get, etc.
    const doc = JSON.parse(cachedValue);

    /* eslint-disable */
    const cachedDocument = Array.isArray(doc) 
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
    /* eslint-enable */
    return cachedDocument;
  }

  // If not there execute query and cache result.
  const result = await exec.apply(this, args);
  client.set(key, JSON.stringify(result));
  return result;
};
