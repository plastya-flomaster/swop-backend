const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports =  validateRegisterInput = (data) => {

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
    data.password = checkField(data.password);
    data.date = checkField(data.date);

    //name check
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Поле \'Имя\' Обязательно';
    }

    //email check
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Поле \'Email\' обязательно';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Поле \'Email\' некорректно';
    }

    //password check
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Поле \'Пароль\' обязательно';
    }

    //password confirm check
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Поле \'Подтвердите пароль\' обязательно';
    }

    //check for password length
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Пароль должен быть минимум из 6 символов';
    }
    //check for matching password's fields
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Пароли должны совпадать';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
