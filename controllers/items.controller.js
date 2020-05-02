const Items = require('../Models/Items');
const Category = require('../Models/Category');
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
        return res.status(500).send('Ошибка');
    }

    const payload = req.body;
    const query = {
        'userId': req.params.id,
        'items._id': req.body._id
    }
    Items.findOneAndUpdate(query,
        {
            "$set":
                { "items.$": payload }
        }, { new: true },
        (err, doc) => {
            if (doc) {
                replaceCategory(doc.items).then(subDoc => { return res.status(200).send(subDoc); }).catch(err => {
                    return res.status(500).send('Что-то пошло не ' + err);
                });
            };
            if (err) return res.status(500).send('Невозможно обновить товар: ' + err);
        });
}


//добавить новый товар в записи
exports.createNewItem = (req, res) => {
    const newItem = {
        _id: mongoose.Types.ObjectId(),
        ...req.body
    }
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
exports.getItemsToSwap = (req, res) => {
    const userId = req.params.id;
    let final = [];
    Items.find().then(items => {
        if (!items) return res.status(400).send('Нет товаров!');
        const newAllItemsCollection = items.filter((items) => items.userId !== userId)
        newAllItemsCollection.map((itemsC) => {
            final.push(...itemsC.items)
        })

        if (final) return res.status(200).send(final);
        else return res.status(500).send('helo');

    }).catch(err => { return res.status(500).send(err) });
}

//найти товары юзера
exports.getAllMine = (req, res) => {
    const userId = req.params.id;
    Items.findOne({ userId }).then(items => {
        if (!items) {
            return res.status(400).send('Ошибка пользователя нет в базе товаров!');
        } else {
            if (items.items) {
                replaceCategory(items.items).then(
                    subDoc => {
                        return res.status(200).send(subDoc);
                    }
                );
            }
            else return res.status(400).send('Пока у вас нет товаров, чтобы обменяться! Добавьте новый товар!');
        }
    }).catch(err => { return res.status(500).send(err) });
}

const replaceCategory = (subDoc) => {
    
    return Category.find().then(categories => {
        subDoc.map(item => {
            item.category = categories.find(category => category.id === item.category);
                
        });
        return subDoc;
    });
};

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