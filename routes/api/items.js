const express = require('express');
const router = express.Router();

const items = require('../../controllers/items.controller');

//создаем нового 
router.post('/:id', items.create);

//@route GET api/items/:id
//@desc Loads all files into items
//@access Public
router.get('/:id', items.getAllMine);

//@route GET api/items/add/:id&:itemId
//@desc Добавляет новый товар до нового состояния
//@access Public
router.put('/add/:id', items.update);

//плучаем все товары на которые можно поменяться
router.get('/cards/:id', items.findAllActive);

router.post('/:id/edit/:itemId', items.updateItem);

module.exports = router;