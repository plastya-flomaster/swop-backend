const Items = require('../Models/Items');
const mongoose = require('mongoose');

//создать запись в базе вместе с регистрацией юзера
exports.create = (req, res) => {
    const userId = req.params.id;
    Items.findOne({ userId }).then(item => {
        if (item)
            return res.status(500).send('товары для такого пользователя уже обозначены');
    });

    const items = new Items({
        userId,
        items: []
    });

    items.save().then(item => res.status(200).json(item)).catch(err => { return res.status(500).send('Ошибка: ' + err) });
};

//редактировать определенный товар
exports.updateItem = (req, res) => {

    if (!req.body) {

    }

    const payload = req.body;
    const query = {
        'userId': req.params.id,
        'items.item_id': req.params.itemId
    }

    Items.findOne(query).then(item => {
        return res.status(200).send(item);
    })

}
//добавить новый товар в записи
exports.createNewItem = (req, res) => {

    
    const newItem = {
        _id: mongoose.Types.ObjectId(),
        ...req.body
    }
    console.log(newItem);

    const update = {
        "$push": {
            "items": newItem
        }
    };

    const query = {
        'userId': req.params.id
    };

    Items.findOneAndUpdate(query, update, { new: true })
        .then(item => {
            if (!item)
                return res.status(404).send('невозможно добавить товар. пользователя нет!');
            return res.status(200).send(item);
        }).catch(err => { return res.status(500).send('Ошибка: ' + err) });

};

//получить все товары из бд, кроме товаров юзера, на которые можно поменяться
exports.findAllActive = (req, res) => {

}

//найти товары юзера
exports.getAllMine = (req, res) => {
    const userId = req.params.id;
    const items = Items.findOne({ userId }).then(items => {
        if (!items) {
            return res.status(400).send('Ошибка пользователя нет в базе товаров!');
        } else {
            if (items.items) { return res.status(200).send(items.items); }
            else return res.status(400).send('Пока у вас нет товаров, чтобы обменяться! Добавьте новый товар!');
        }
    }).catch(err => { return res.status(500).send(err) });
}

exports.getAllMineFinished = (req, res) => {

}
// //обновить товар по айди
// exports.update = (req, res) => {
//     return res.status(200).send('deleted');
// }
//удалить товар по айди
exports.delete = (req, res) => {
}
//удалить все товары юзера
exports.deleteAll = (req, res) => {

}