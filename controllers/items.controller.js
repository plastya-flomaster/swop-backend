const Items = require('../Models/Items');
const Category = require('../Models/Category');
const LikedItems = require('../Models/LikedItems');
const mongoose = require('mongoose');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const isEmpty = require('is-empty');

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
      fs.mkdirSync(
        `./public/${item.userId}/${item.items[item.items.length - 1]._id}`
      );
      return res.status(200).send(item.items);
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
//Очищает папку с изображениями
exports.clearDir = (req, res, next) => {
  const dir = `./public/${req.headers.userid}/${req.headers.itemid}`;

  Items.findOne({ userId: req.headers.userid }).then((itemC) => {
    const item = itemC.items.find((item) => item._id == req.headers.itemid);
    fs.readdir(dir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        item.photos.map((url) => {
          if (!url.includes(file)) {
            fs.unlink(path.join(dir, file), (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
    next();
  });
};

exports.uploadPhotos = (req, res) => {
  const userId = req.headers.userid;
  const itemId = req.headers.itemid;
  const reqFiles = [];
  const url = 'http://localhost:5000/public';
  req.files.map((file) => {
    reqFiles.push(url + `/${userId}/${itemId}/` + file.filename);
  });

  Items.findOne({ userId }).then((itemCollection) => {
    const arrItem = itemCollection.items.filter(
      (item) => String(item._id) === itemId
    );

    let item = arrItem[0];
    item.photos = [...reqFiles, ...item.photos];

    const payload = item;
    const query = {
      userId,
      'items._id': itemId,
    };

    Items.findOneAndUpdate(
      query,
      {
        $set: { 'items.$': payload },
      },
      { new: true },
      (err, doc) => {
        if (doc) return res.status(200).send(doc.items);
        if (err)
          return res.status(500).send('Невозможно обновить товар: ' + err);
      }
    );
  });
};

exports.getAllMineFinished = (req, res) => {};

exports.getAllMineFinished = (req, res) => {};

//удалить товар по айди
exports.delete = (req, res) => {
  const userId = req.params.id;
  const _id = req.body.itemId;

  const update = {
    $pull: {
      items: {
        _id,
      },
    },
  };

  Items.findOneAndUpdate({ userId }, update, { new: true }, (err, doc) => {
    if (err) return res.status(500).send(err);
    if (isEmpty(doc)) return res.status(500).send('ничего не вышло!');
    return doc;
  })
    .then((items) => {
      rimraf(`public/${userId}/${_id}`, () => console.log('Папка удалена'));
      return res.status(200).send(items.items);
    })
    .catch((err) => res.status(500).send(err));
};
//удалить все товары юзера
exports.deleteAll = (req, res) => {};
