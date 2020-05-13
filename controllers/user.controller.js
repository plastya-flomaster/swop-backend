const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

//Валидации
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateUserInfo = require('../validation/update');

//Загрузка моделей
const User = require('../Models/User');
const Items = require('../Models/Items');
const LikedItems = require('../Models/LikedItems');

const domain = require('../config/utils');

exports.register = (req, res) => {
  //валидация формы регистрации
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
              fs.mkdir(`./public/${user._id}`, () => {
                fs.mkdir(`./public/${user._id}/avatar`, () => {
                  console.log('папка создана');
                });
              });
              const items = new Items({
                userId: user._id,
                items: [],
              });
              items.save().catch((err) => res.status(500).send(err));

              createLikedItems(user._id).then((liked) => {
                if (liked) {
                  return res.status(200).send('Регистрация прошла успешно');
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
  } catch (event) {
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
            expiresIn: 31556926, // 1 год
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

exports.delete = (req, res, next) => {
  const _id = mongoose.Types.ObjectId(req.params.id);
  User.findByIdAndDelete(_id)
    .then((user) => {
      if (!user)
        return res.status(404).send(`Пользователя с id ${_id} не найдено`);
      rimraf(`public/${_id}`, () =>
        console.log(`Папка с изображениями товаров пользователя ${_id} удалена`)
      );
      next();
    })
    .catch((err) => res.status(500).send(err));
};

exports.uploadAvatar = (req, res) => {
  const _id = req.params.id;
  const url = `${domain}/public/${_id}/avatar/${req.file.filename}`;

  User.findOneAndUpdate(
    { _id },
    { avatar: url },
    { new: true },
    (err, user) => {
      if (user) return res.status(200).send(user);
      if (err) return res.status(500).send('Невозможно загрузить фото: ' + err);
    }
  );
};
exports.clearDirectory = (req, res, next) => {
  const _id = req.params.id;
  const dir = `./public/${_id}/avatar`;

  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(dir, file), (err) => {
        if (err) throw err;
      });
    }
    next();
  });
};
