const express = require('express');
const router = express.Router();

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

//плучаем все товары на которые можно поменяться
router.get('/cards/:id', items.findAllActive);

router.post('/:id/edit/:itemId', items.updateItem);

module.exports = router;