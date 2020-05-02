const Categories = require('../Models/Category');

//получаем справочник категорий
exports.getAllCategories = (req, res) => {
  Categories.find()
    .then((categories) => {
      if (categories) return res.status(200).send(categories);
      else return res.status(400).send('нет записей о категориях!');
    })
    .catch((err) => res.status(500).send(err));
};
