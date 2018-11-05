const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateExperienceInput = (data) => {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if(Validator.isEmpty(data.title)) {
        errors.title = 'Job title is required!';
    }

    if(Validator.isEmpty(data.company)) {
        errors.company = 'Job company is required!';
    }

    if(Validator.isEmpty(data.from)) {
        errors.from = 'Job from date is required!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}