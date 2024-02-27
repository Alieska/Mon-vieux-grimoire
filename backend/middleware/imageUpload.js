const multer = require('multer');
const sharp = require ('sharp');
const path = require('path');
const fs = require (`fs`);

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '-' + Date.now() +'.'+ extension);
  }
});

module.exports = multer({storage: storage}).single('image');

module.exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = `images/${req.file.filename}`;
  const tempOutputPath = imagePath + '.tmp';

  try {
    await sharp(imagePath).resize(600).toFile(tempOutputPath);
    fs.renameSync(tempOutputPath, imagePath);

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};