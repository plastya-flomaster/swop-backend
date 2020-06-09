const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateItem = (item) => {
  let errors = {};

  if (Validator.isEmpty(item.title)) {
    errors.title = 'Введите название товара!';
  }

  if (!Validator.isLength(item.description, { min: 0, max: 140 })) {
    errors.description = 'Описание не может быть больше 140 знаков';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
