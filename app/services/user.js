/**
 * @module         services
 * @file           userRegistration.services.js
 * @description    This file contain all the service  
 * @author         Aakash Rajak <aakashrajak2809@gmail.com>
       
------------------------------------------------------------------------------------------*/
const userModel = require('../models/user');
const logger = require("../../config/logger");
const resposnsCode = require("../../util/staticFile.json");

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
                    message: 'Mail id alredy registered',
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
                            data: registrationResult
                        }
                        callback(null, registrationResult);
                    }
                })
            }
        });
    }
}

module.exports = new userServices