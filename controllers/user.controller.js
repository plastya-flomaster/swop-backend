const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const mongoose = require('mongoose');

//load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

//loading user model
const User = require('../Models/User');
const Items = require('../Models/Items');

exports.register = (req, res) => {
    //form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Такой Email уже существует' });
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            const items = new Items({
                                userId: user._id,
                                items: []
                            });
                            items.save().catch(err => {
                                return res.status(500).json(err)
                            })
                            return res.status(200).json(user)
                        })
                            .catch(err => res.status(500).send(err));
                    });
                });
            }
        });
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
                    name: user.name,
                    email: user.email,
                    instagram: user.instagram,
                    phone: user.phone,
                };
                //signing token
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 31556926 //lasts 1 year
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: token,
                        info: user
                    });
                });
            } else {
                return res.status(400).json({ password: 'Неверный пароль!' });
            }
        });
    });
}
//получаю информацию о пользвателе
exports.getInfo = (req, res) => {
    const _id = 0;
    try {
        _id = mongoose.Types.ObjectId(req.params.id);
    } catch (err) {
        return res.status(500).send('Неверный формат id');
    }

    User.findOne({ _id }).then(user => {
        if (!user)
            return res.status(404).send(`Пользователя с id ${_id} не найдено`);
        else res.send(user);
    }).catch(err => res.status(500).send(err));
};

//обновляю информацию о пользователе
exports.update = (req, res) => {
    const _id = req.params.id;
    const update = req.query

    User.updateOne({ _id }, update)
        .then(() => User.findOne({ _id }))
        .then(result => { return res.status(200).send(result) })
        .catch(err => res.status(500).send(err));
}

exports.delete = (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id);
    User.findByIdAndDelete(_id)
        .then(user => {
            if (!user)
                return res.status(404).send(`Пользователя с id ${_id} не найдено`);
            else {
                Items.findOneAndRemove({ userId: _id })
                .catch(err => res.status(500).send(err));
                return res.status(200).send('Удален!');

            }
        }).catch(err => res.status(500).send(err));
}


