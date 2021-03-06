/**
 * @module        middlewares\userValidator
 * @file         userValidator.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
*  @since
----------------------------------------------------------------------------------------------------*/

const joi = require('joi');

module.exports = joi.object({
    firstName: joi.string().required().regex(/^[A-Z]{1}[a-zA-Z ]{2,}$/),
    lastName: joi.string(),
    email: joi.string().required(),
    password: joi.string().required().regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_])[a-zA-Z0-9\\~\\?\\.\\+\\-\\~\\!\\@\\#\\$\\%\\^\\&\\*\\_]{8,}$/),
    confirmPassword: joi.string().required(),
});
