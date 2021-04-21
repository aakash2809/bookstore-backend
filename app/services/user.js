/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/
const userModel = require('../models/user');
const logger = require("../../config/logger");
const resposnsCode = require("../../util/staticFile.json");
const jwtAuth = require("../middlewares/helper");
const bycrypt = require('bcryptjs');

class userServices {

    /**
     * @description save request data to database using model methods
     * @param {*} registrationData holds data to be saved in json formate
     * @param {*} callback holds a function 
    */
    registerUser = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside services`);
        return userModel.checkMailExistenceInDb(registrationData, (error, mailIdExistance) => {
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: error
                }
                callback(error, null)
            } else if (mailIdExistance[0] != null || mailIdExistance[0] != undefined) {
                let registrationResult = ""
                registrationResult = {
                    success: false,
                    statusCode: resposnsCode.ALREADY_EXIST,
                    message: 'Mail id already registered',
                }
                callback(null, registrationResult);
            } else {
                userModel.register(registrationData, (error, registrationResult) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                            message: error
                        }
                        callback(error, null)
                    } else {
                        registrationResult = {
                            success: true,
                            statusCode: resposnsCode.SUCCESS,
                            message: 'account registered successfully',
                        }
                        callback(null, registrationResult);
                    }
                })
            }
        });
    }

    /**
 * @description validate credentials and return result accordingly to database using model methods
 * @param {*} loginCredentials holds data to be saved in json formate
 * @param {*} callback holds a function 
*/
    validateAndLogin = (loginCredentials, callback) => {
        return userModel.getDetailOfGivenEmailId(loginCredentials, (error, loginResult) => {

            let loginFilteredResult = this.extractObjectFromArray(loginResult);
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: error
                }
                callback(error, null)
            }
            else if (loginFilteredResult == null) {
                loginFilteredResult = {
                    success: false,
                    statusCode: resposnsCode.NOT_FOUND,
                    message: "email id does not exist"
                }
                callback(null, loginFilteredResult);
            } else {
                bycrypt.compare(loginCredentials.password, loginFilteredResult.password, (error, result) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.BAD_REQUEST,
                            message: 'Invalid password'
                        }
                        callback(error, null);
                    }
                    else if (result) {
                        var token = jwtAuth.genrateToken(loginFilteredResult);
                        loginFilteredResult = {
                            success: true,
                            statusCode: resposnsCode.SUCCESS,
                            message: 'login successfull',
                            data: token,
                            user: loginResult
                        }
                        logger.info(` token genrated: ${token}`);
                        callback(null, loginFilteredResult);
                    } else {
                        error = {
                            success: false,
                            statusCode: resposnsCode.BAD_REQUEST,
                            message: 'Invalid password',
                        }
                        callback(error, null);
                    }
                });
            }
        });
    }

    /**
      * @description extract json object from array
      * @param {*} objectInArray holds data having the array
      */
    extractObjectFromArray = (objectInArray) => {
        var returnObj = null;
        (objectInArray < 1) ? returnObj : returnObj = {
            name: objectInArray[0].name,
            _id: objectInArray[0]._id,
            password: objectInArray[0].password
        }
        return returnObj;
    }
}

module.exports = new userServices