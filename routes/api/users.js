const express = require('express');
const router = express.Router();

const user = require('../../controllers/user.controller');

//@route POST api/users/register
//@desc Register user
//@access Public
router.post('/register', user.register);

//@route POST api/users/login
//@desc Login user and return JWT token
//@access Public
router.post('/login', user.login);

//@route PUT api/users/update
//@desc Обновляет переданные поля для пользователя
//@access Public
//пример запроса: api/users/5e9dabcdc84d114cece8c39d/update?name=Настя&contacts[phone]=+79223260399&contacts[instagram]=@plastya
router.put('/:id/update', user.update);

//@route GET api/users/:id
//@desc Получает данные пользователя по айди
//@access Public
router.get('/:id', user.getInfo);

//@route GET api/users/:id
//@desc Удаляет пользователя по айди
//@access Public
router.delete('/:id', user.delete);

module.exports = router;