const LikedItems = require('../Models/LikedItems');
const Items = require('../Models/Items');
const User = require('../Models/User');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  try {
    const userId = req.params.id;
    const collection = await LikedItems.findOne({ userId });

    if (collection) {
      return res
        .status(400)
        .send('LikedItems для такого пользователя уже создан');
    }

    const newLikedItemsCollection = new LikedItems({
      userId,
      pairs: [],
    });

    await newLikedItemsCollection.save();

    return res.status(200).send('likeditems создан');
  } catch (e) {
    res.status(500).send('Что-то пошло не так');
  }
};

exports.addPairs = async (req, res) => {
  try {
    const { id, otherId, itemId } = req.body;

    const LikedItemsCollection = await LikedItems.findOne({ userId: id });

    if (!LikedItemsCollection) {
      return res
        .status(400)
        .send('LikedItems для такого пользователя еще не создана');
    }
    // Если у пользователя нет ни одной пары
    if (LikedItemsCollection.pairs.lenght === 0) {
      const LikedItem = {
        userId: otherId,
        items: [itemId],
      };

      const pairs = [LikedItem];

      await LikedItems.updateOne({ _id: LikedItemsCollection._id }, { pairs });

      return res.status(200).send('likedItem добавлен');
    }

    let idxPair;

    const pair = LikedItemsCollection.pairs.find((pair, idx) => {
      idxPair = idx;
      return pair.userId === otherId;
    });

    //Если пара с этим пользователем уже есть
    if (pair) {
      const items = [...pair.items, itemId];

      const LikedItem = {
        userId: otherId,
        items,
      };

      const pairs = [
        ...LikedItemsCollection.pairs.slice(0, idxPair),
        LikedItem,
        ...LikedItemsCollection.pairs.slice(idxPair + 1),
      ];

      await LikedItems.updateOne({ _id: LikedItemsCollection._id }, { pairs });

      return res.status(200).send('likedItem добавлен');
    }
    const LikedItem = {
      userId: otherId,
      items: [itemId],
    };

    const pairs = [...LikedItemsCollection.pairs, LikedItem];

    await LikedItems.updateOne({ _id: LikedItemsCollection._id }, { pairs });

    return res.status(200).send('likedItem добавлен');
  } catch (e) {
    res.status(500).send('Что-то пошло не так');
  }
};

exports.search = async (req, res) => {
  try {
    const userId = req.params.id;
    const LikedItemsCollection = await LikedItems.findOne({ userId });

    if (!LikedItemsCollection) {
      return res.status(400).send('LikedItems не найдена');
    }

    const pairs = LikedItemsCollection.pairs;

    if (!pairs) {
      return res.status(400).send('У вас пока нет понравившихся вещей');
    }

    const otherLikedItems = await LikedItems.find({
      'pairs.userId': userId,
    });

    if (!otherLikedItems) {
      return res.status(400).send('У вас пока нет совподений');
    }

    let allItems = [];
    const allItemsData = await Items.find();

    allItemsData.map((itemsC) => {
      allItems.push(...itemsC.items);
    });

    const found = [];

    await Promise.all(
      pairs.map(async (pair) => {
        const otherUser = otherLikedItems.find(
          (likenItems) => likenItems.userId === pair.userId
        );
        if (otherUser) {
          const myItems = otherUser.pairs.find(
            (pair) => pair.userId === userId
          );

          let myItemsObj = [];
          myItems.items.map((itemId) => {
            const itemObj = allItems.find(
              (item) => String(item._id) === itemId
            );
            if (itemObj) myItemsObj.push(itemObj);
          });

          yourItemsObj = [];
          pair.items.map((itemId) => {
            const itemObj = allItems.find(
              (item) => String(item._id) === itemId
            );
            if (itemObj) yourItemsObj.push(itemObj);
          });

          const userInfo = await User.findOne(
            { _id: pair.userId },
            { password: false, date: false, __v: false }
          );

          found.push({
            userInfo,
            myItems: myItemsObj,
            yourItems: yourItemsObj,
          });
        }
      })
    );

    return res.status(200).send(found);
  } catch (e) {
    res.status(500).send('Что то пошло не так');
  }
};
