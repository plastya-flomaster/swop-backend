const Items = require('../Models/Items');
const Category = require('../Models/Category');
const LikedItems = require('../Models/LikedItems');
const mongoose = require('mongoose');

//создать запись в базе вместе с регистрацией юзера
exports.create = (req, res) => {
  const userId = req.params.id;
  Items.findOne({ userId }).then((item) => {
    if (item)
      return res
        .status(500)
        .send(`Товары для пользователя ${userId} уже обозначены`);
  });

  const items = new Items({
    userId,
    items: [],
  });

  items
    .save()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      return res.status(500).send('Ошибка: ' + err);
    });
};

//редактировать определенный товар
exports.updateItem = (req, res) => {
  if (!req.body) {
    return res
      .status(500)
      .send('Ошибка. Невозможно обновить товар, т.к. данных нет');
  }

  const payload = req.body;
  const query = {
    userId: req.params.id,
    'items._id': req.body._id,
  };
  Items.findOneAndUpdate(
    query,
    {
      $set: { 'items.$': payload },
    },
    { new: true },
    (err, doc) => {
      if (doc) return res.status(200).send(doc.items);
      if (err) return res.status(500).send('Невозможно обновить товар: ' + err);
    }
  );
};

//добавить новый товар в записи
exports.createNewItem = (req, res) => {
  const newItem = {
    _id: mongoose.Types.ObjectId(),
    userId: req.params.id,
    ...req.body,
  };

  const update = {
    $push: {
      items: newItem,
    },
  };

  const query = {
    userId: req.params.id,
  };

  Items.findOneAndUpdate(query, update, { new: true })
    .then((item) => {
      if (!item)
        return res
          .status(404)
          .send('Невозможно добавить товар. пользователя нет!');
      return res.status(200).send(item);
    })
    .catch((err) => {
      return res.status(500).send('Ошибка: ' + err);
    });
};

//получить все товары из бд, кроме товаров юзера, на которые можно поменяться
exports.getItemsToSwap = (req, res) => {
  const userId = req.params.id;

  let final = [];
  Items.find()
    .then((items) => {
      if (!items) return res.status(400).send('Нет товаров!');
      const newAllItemsCollection = items.filter(
        (items) => items.userId !== userId
      );
      newAllItemsCollection.map((itemsC) => {
        final.push(...itemsC.items);
      });

      LikedItems.findOne({ userId }).then((likedItems) => {
        Promise.all(
          likedItems.disLike.map((disId) => {
            final = final.filter((item) => String(item._id) !== disId);
          })
        ).then(() => {
          let likes = [];
          likedItems.pairs.map((pair) => {
            likes = [...likes, ...pair.items];
          });
          Promise.all(
            likes.map((like) => {
              final = final.filter((item) => String(item._id) !== like);
            })
          ).then(() => res.status(200).send(final));
        });
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

//найти товары юзера
exports.getAllMine = (req, res) => {
  const userId = req.params.id;
  Items.findOne({ userId })
    .then((items) => {
      if (!items) {
        return res.status(400).send('Ошибка пользователя нет в базе товаров!');
      } else {
        if (items.items) {
          return res.status(200).send(items.items);
        } else
          return res
            .status(400)
            .send(
              'Пока у вас нет товаров, чтобы обменяться! Добавьте новый товар!'
            );
      }
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

exports.getAllMineFinished = (req, res) => {};

exports.getAllMineFinished = (req, res) => {};

//удалить товар по айди
exports.delete = (req, res) => {
  const userId = req.params.id;
};
//удалить все товары юзера
exports.deleteAll = (req, res) => {};
