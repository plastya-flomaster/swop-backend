const express = require('express');
const router = express.Router();

const Image = require('../../Models/Images');

router.post('/api/photo', function (req, res) {
  let image = new Image();
  image.img.data = fs.readFileSync(req.files.userPhoto.path);
  image.img.contentType = 'image/png';
  image.save();
});

module.exports = router;
