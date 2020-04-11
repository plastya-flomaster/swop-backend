const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {

    const checkField = (input) => {
        let str = '';
        if (!isEmpty(input)) {
            str = input;
        }
        return str;
    }

    let errors = {};

    //convert empty fields to an empty strings
    data.name = checkField(data.name);
    data.email = checkField(data.email);
    data.passemail = checkField(data.passemail);
    data.date = checkField(data.date);

    //name check
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Поле \'Имя\' Обязательно';
    }

    //email check
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Поле \'Email\' Обязательно';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Поле \'Email\' некорреpassword';
    }

    //password check
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Поле \'Пароль\' Обязательно';
    }

    //password confirm check
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Поле \'Подтвердите пароль\' Обязательно';
    }

    //check for password length
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Пароль должен быть минимум из 6 символов';
    }
    //check for matching password's fields
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Пароль должны совпадать';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
