const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateUserInfo = (user) => {
    
    const checkField = (input) => {
        let str = '';
        if (!isEmpty(input)) {
            str = input;
        }
        return str;
    }

    let errors = {};

    const phoneno = /^\d{11}$/;

    if(!user.phone.match(phoneno)) {
        errors.phone = 'Номер должен быть в формате 8 999 999 99 99';
    }

    if(isEmpty(user.name)) {
        errors.name = 'Имя не может быть пустым!'
    }

    const insta = /(?:@)([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;
    if(!user.instagram.match(insta)) {
        errors.instagram = 'Введите корректный instagram никнейм';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }

};