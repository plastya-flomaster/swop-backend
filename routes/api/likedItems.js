const express = require('express');
const router = express.Router();

const likedItems = require('../../controllers/likedItems.controller');

//Создается элемент коллекции для likedItems
// ../api/likeditems/create/:id
router.post('/create/:id', likedItems.create);

//Добавление понравившейся вещи
//Принимает
//id = id пользователя,
//otherId = id владельца понравившейся вещи,
//itemId = id понравившейся вещи
// ../api/likeditems/addpairs/:id
router.put('/addpairs/:id', likedItems.addPairs);

//Поиск совпадений
// Принимает userId = id пользователя
// ../api/likeditems/search/:id
router.get('/search/:id', likedItems.search);

//Добвление disLike
//id = id пользователя
//body:
//itemId = id вещи
// ../api/likeditems/dislike/:id
router.put('/dislike/:id', likedItems.disLike);

module.exports = router;
