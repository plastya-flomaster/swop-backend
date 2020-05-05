const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuidv4 = require('uuid').v4;
const fs = require('fs');
const path = require('path');

const items = require('../../controllers/items.controller');

//создаем нового
router.post('/:id', items.create);

//@route GET api/items/:id
//@desc получаем все товары юзера
//@access Public
router.get('/:id', items.getAllMine);

//@route GET api/items/add/:id&:itemId
//@desc Добавляет новый товар к пользователю
//@access Public
router.post('/add/:id', items.createNewItem);

//@route GET api/items/edit/:id
//обновляем сведения о своем товаре
router.post('/edit/:id', items.updateItem);

//@route GET api/items/swap/:id
//получаем все товары, на которые можно меняться
router.get('/swap/:id', items.getItemsToSwap);

//upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./public/${req.headers.userid}/${req.headers.itemid}`;
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
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

//@route POST api/items/upload-images
router.post(
  '/upload-images/i',
  items.clearDir,
  upload.array('imgCollection', 6),
  items.uploadPhotos
);
//@route DELETE api/items/delete/:id
//удаляет товары по айди
router.delete('/delete/:id', items.delete);

module.exports = router;
