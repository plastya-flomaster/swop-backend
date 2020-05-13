const express = require('express');
const router = express.Router();

const user = require('../../controllers/user.controller');
const items = require('../../controllers/items.controller');
const likedItems = require('../../controllers/likedItems.controller');

const multer = require('multer');
const uuidv4 = require('uuid').v4;

//@route POST api/users/register
//@desc Register user
//@access Public
router.post('/register', user.register);

//@route POST api/users/login
//@desc Login user and return JWT token
//@access Public
router.post('/login', user.login);

//@route PUT api/users/:id/update
//@desc Обновляет переданные поля для пользователя
//@access Public
router.put('/:id/update', user.update);

//upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./public/${req.params.id}/avatar`;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Только .png, .jpg и .jpeg форматы!'));
    }
  },
});

//@route PUT api/users/avatar/:id
//@desc загружает аватар пользователя
//@access Public
router.put(
  '/avatar/:id',
  user.clearDirectory,
  upload.single('user-avatar'),
  user.uploadAvatar
);

//@route GET api/users/:id
//@desc Получает данные пользователя по айди
//@access Public
router.get('/:id', user.getInfo);

//@route GET api/users/:id
//@desc Удаляет пользователя по айди
//@access Public
router.delete(
  '/:id',
  user.delete,
  items.deleteCollection,
  likedItems.deleteCollection
);

module.exports = router;
