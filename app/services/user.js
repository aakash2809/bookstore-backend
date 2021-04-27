/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>  
------------------------------------------------------------------------------------------*/
const userModel = require('../models/user');
const logger = require("../../config/logger");
const resposnsCode = require("../../util/staticFile.json");
const helper = require("../middlewares/helper");
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
            let loginResponse = '';
            if (error) {
                error = {
                    success: false,
                    statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: error
                }
                callback(error, null)
            }
            else if (loginResult[0] == null) {
                loginResponse = {
                    success: false,
                    statusCode: resposnsCode.NOT_FOUND,
                    message: "email id does not exist"
                }
                callback(null, loginResponse);
            } else {
                bycrypt.compare(loginCredentials.password, loginResult[0].password, (error, result) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.BAD_REQUEST,
                            message: 'Invalid password'
                        }
                        callback(error, null);
                    }
                    else if (result) {
                        var token = helper.genrateToken(loginResult);
                        loginResponse = {
                            success: true,
                            statusCode: resposnsCode.SUCCESS,
                            message: 'login successfull',
                            data: token,
                            user: loginResult
                        }
                        logger.info(` token genrated: ${token}`);
                        callback(null, loginResponse);
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
    * @description validate credentials and return result accordingly to database using model methods
    * @param {*} email 
    * @param {*}  callback callback funcntion
    */
    getEmail = (email, callback) => {
        logger.info(`TRACKED_PATH: Inside services getEmail`);
        userModel.forgetPassword(email, (error, result) => {
            if (error) {
                callback(error, null);
            }
            else if (result.length < 1) {
                result = {
                    message: "User with this email id does not exist",
                    status: resposnsCode.NOT_FOUND,
                    data: null
                }
                callback(null, result);
            }
            else {
                var token = helper.genrateToken(result);
                helper.sendMailToResetPassword(result[0], token, (error, mailRespnse) => {
                    if (error) {
                        error = {
                            success: false,
                            statusCode: resposnsCode.INTERNAL_SERVER_ERROR,
                            message: error,
                        }
                        callback(error, null);
                    } else {
                        mailRespnse = {
                            success: true,
                            statusCode: resposnsCode.SUCCESS,
                            message: 'mail sent successfully to given email id',
                            data: mailRespnse
                        }
                        callback(null, mailRespnse);
                    }
                });
            }
        })
    }
}

module.exports = new userServices