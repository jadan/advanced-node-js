const { Buffer } = require('safe-buffer');
const Keygrip = require('keygrip');
const keys = require('../../config/keys');

const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      // User _id is not a string, but an object.
      /* eslint-disable-next-line */
      user: user._id.toString()
    }
  };
  const session = Buffer
    .from(JSON.stringify(sessionObject))
    .toString('base64');
  const sig = keygrip.sign(`session=${session}`);
  return { session, sig };
};
