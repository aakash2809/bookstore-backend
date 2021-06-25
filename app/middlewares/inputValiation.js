/**
 * @module        middlewares\inputValidation
 * @file          inputValidation.js
 * @description   This file contains Joi validation object for schema validation
 * @requires      {@link https://www.npmjs.com/package/joi | joi}
 * @author        Aakash Rajak <aakashrajak2809@gmail.com>
----------------------------------------------------------------------------------------------------*/
const joi = require('joi');

class Validator {
  /**
    * @description validate note Detail for search note by title joi rules
    * @param booksCostRange  having all search detail which is to be validated
    */
  validateCostRangeInput = (booksCostRange) => {
    const booksCostRangeInputRules = joi.array()
      .items({
        min: joi.number().required(),
        max: joi.number().required(),
      });
    return booksCostRangeInputRules.validate(booksCostRange);
  }
}

module.exports = new Validator();
