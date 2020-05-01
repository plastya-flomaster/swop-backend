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

//@route GET api/items/edit/:id
//обновляем сведения о своем товаре
router.post('/edit/:id', items.updateItem);

//@route GET api/items/swap/:id
//получаем все товары, на которые можно меняться
router.get('/swap/:id', items.getItemsToSwap);

module.exports = router;
