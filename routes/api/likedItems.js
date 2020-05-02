const express = require('express');
const router = express.Router();

const likedItems = require('../../controllers/likedItems.controller');

//Создается объект для likeItems
router.post('/create/:id', likedItems.create);

//Добавление понравившейся вещи
//Принимает
//id = id пользователся,
//otherId = id владельца понравившейся вещи,
//itemId = id понравившейся вещи
router.put('/addpairs', likedItems.addPairs);

//Поиск совподений
// Принимает userId = id пользователя
router.get('/search/:id', likedItems.search);

module.exports = router;
