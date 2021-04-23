/**
 * @module        middlewares\bookValidator
 * @file          bookValidator.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
*  @since        
----------------------------------------------------------------------------------------------------*/

const joi = require('joi');

module.exports = joi.object({
    author: joi.string().required().min(3),
    title: joi.string().required().min(3),
    quantity: joi.number().min(3),
    price: joi.number().min(3),
    description: joi.string().required().min(6),
    image: joi.string().required().min(6)
});
