const { clearCache } = require('../services/cache');

// await next() trick to execute function after request
module.exports = async (req, res, next) => {
  await next();
  clearCache(req.user.id);
};
