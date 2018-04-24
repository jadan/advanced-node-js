const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const requireLogin = require('../middlewares/requireLogin');
const { accessKeyId, secretAccessKey } = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-west-1'
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const Key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl('putObject', {
      Bucket: 'course-blog-bucket',
      ContentType: 'image/jpeg',
      Key
    }, (err, url) => res.send({ Key, url }));
  });
};
