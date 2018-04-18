
require('../models/User');

/* eslint-disable-next-line no-undef */
jest.setTimeout(15000);

const mongoose = require('mongoose');
const keys = require('../config/keys');

// use nodeJS global promise object
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
