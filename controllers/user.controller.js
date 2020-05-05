const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const mongoose = require('mongoose');
const fs = require('fs');
const rimraf = require('rimraf');

//load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateUserInfo = require('../validation/update');

//Загрузка моделей
const User = require('../Models/User');
const Items = require('../Models/Items');
const LikedItems = require('../Models/LikedItems');

exports.register = (req, res) => {
  //form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Такой Email уже существует' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const items = new Items({
                userId: user._id,
                items: [],
              });
              items.save().catch((err) => res.status(500).send(err));

              createLikedItems(user._id).then((liked) => {
                if (liked) {
                  fs.mkdirSync(`./public/${user._id}/`);
                  return res.status(200).json(user);
                }
              });
            })
            .catch((err) => res.status(500).send(err));
        });
      });
    }
  });
};
const createLikedItems = async (userId) => {
  try {
    const collection = await LikedItems.findOne({ userId });

    if (collection) {
      return res
        .status(400)
        .send('LikedItems для такого пользователя уже создан');
    }

    const newLikedItemsCollection = new LikedItems({
      userId,
      pairs: [],
      disLike: [],
    });

    await newLikedItemsCollection.save();

    return true;
  } catch (e) {
    return false;
  }
};
exports.login = (req, res) => {
  //form validation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: 'Пользователь не найден' });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          _id: user.id,
        };
        //signing token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, //lasts 1 year
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
              info: user,
            });
          }
        );
      } else {
        return res.status(400).json({ password: 'Неверный пароль!' });
      }
    });
  });
};

//получаю информацию о пользвателе
exports.getInfo = (req, res) => {
  const _id = req.params.id;
  // try {
  //     _id = mongoose.Types.ObjectId(req.params.id);
  // } catch (err) {
  //     return res.status(500).send('Неверный формат id');
  // }

  User.findOne({ _id })
    .then((user) => {
      if (!user)
        return res.status(404).send(`Пользователя с id ${_id} не найдено`);
      else res.send(user);
    })
    .catch((err) => res.status(500).send(err));
};

//обновляю информацию о пользователе
exports.update = (req, res) => {
  const { errors, isValid } = validateUserInfo(req.query);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const _id = req.params.id;
  const update = req.query;

  User.updateOne({ _id }, update)
    .then(() => User.findOne({ _id }))
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => res.status(500).send(err));
};

exports.delete = (req, res) => {
  const _id = mongoose.Types.ObjectId(req.params.id);
  User.findByIdAndDelete(_id)
    .then((user) => {
      if (!user)
        return res.status(404).send(`Пользователя с id ${_id} не найдено`);
      else {
        Items.findOneAndRemove({ userId: _id }).catch((err) =>
          res.status(500).send(err)
        );
        rimraf(`public/${_id}`, () => console.log('Папка удалена'));
        return res.status(200).send('Удален!');
      }
    })
    .catch((err) => res.status(500).send(err));
};
