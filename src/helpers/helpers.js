const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports.promiseHandler = (promise) =>
  promise.then((data) => [null, data]).catch((err) => [err]);

let newFileName = '';

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);
    newFileName = Date.now() + ext;
    cb(null, newFileName);
  },
});

module.exports.upload = multer({ storage });

module.exports.addAvatar = (req, res, next) => {
  req.body.avatar = newFileName;
  next();
};

module.exports.getDataForResponse = (userData) => ({
  subscription: userData.subscription,
  _id: userData._id,
  email: userData.email,
  avatarUrl: userData.avatarUrl,
});

module.exports.deleteFile = async (fileName) => {
  try {
    await fs.promises.unlink(`public/images/${fileName}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
};
