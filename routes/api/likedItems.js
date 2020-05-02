const express = require('express');
const router = express.Router();

const likedItems = require('../../controllers/likedItems.controller');

//Создается объект для likeItems
// ../api/likeditems/create/:id
router.post('/create/:id', likedItems.create);

//Добавление понравившейся вещи
//Принимает
//id = id пользователся,
//otherId = id владельца понравившейся вещи,
//itemId = id понравившейся вещи
// ../api/likeditems/addpairs
router.put('/addpairs', likedItems.addPairs);

//Поиск совподений
// Принимает userId = id пользователя
// ../api/likeditems/search/:id
router.get('/search/:id', likedItems.search);

//Добаление disLike
//id = id пользователя
//body:
//itemId = id вещи
// ../api/likeditems/dislike/:id
router.put('/dislike/:id', likedItems.disLike);

module.exports = router;
