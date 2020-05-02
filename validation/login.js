const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
  const checkField = (input) => {
    let str = '';
    if (!isEmpty(input)) {
      str = input;
    }
    return str;
  };

  let errors = {};

  //convert empty fields to an empty strings
  data.email = checkField(data.email);
  data.passemail = checkField(data.passemail);

  //email check
  if (Validator.isEmpty(data.email)) {
    errors.email = "Поле 'Email' Обязательно";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Поле 'Email' некорректно";
  }

  //password check
  if (Validator.isEmpty(data.password)) {
    errors.password = "Поле 'Пароль' Обязательно";
  }

  //check for password length
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Пароль должен быть минимум из 6 символов';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
