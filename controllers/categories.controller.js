const Categories = require('../Models/Category');

//получаем справочник категорий
exports.getAllCategories = (req, res) => {
  Categories.find()
    .then((categories) => {
      if (categories) {
        let fin = {};
        categories.map((elem) => {
          fin[elem._id] = elem.category;
        });
        return res.status(200).send(fin);
      } else return res.status(400).send('нет записей о категориях!');
    })
    .catch((err) => res.status(500).send(err));
};
