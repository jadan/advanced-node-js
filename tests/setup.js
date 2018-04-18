require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// use nodeJS global promise object
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
