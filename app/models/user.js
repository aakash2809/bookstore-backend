/**
 * @module       models
 * @file         userModel.js
 * @description  This module is used for creating the schema and comunicate with mongodb
 *               through mongoose
 * @requires     {@link http://mongoosejs.com/|mongoose} 
 * @requires     bcryptjs module for encryption of password
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const mongoose = require(`mongoose`);
const logger = require("../../config/logger");
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: null

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    role: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true,
    }
);

userSchema.set('versionKey', false);

userSchema.pre("save", async function (next) {
    this.password = await bycrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
})

logger.info('inside model');
const User = mongoose.model(`User`, userSchema);

class UserModel {

    /**
      * @description save request data to database 
      * @param {*} registrationData holds data to be saved in json formate
      * @param {*} callback holds a function 
     */
    register = (registrationData, callback) => {
        logger.info(`TRACKED_PATH: Inside model`);
        const userRegistration = new User(registrationData);
        userRegistration.save((error, registrationResult) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, registrationResult)
            }
        })
    }


    /**
     * @description find email id in database and return data associated with id
     * @param {*} signUpData holds login credentials
     * @param {*} callback holds a function 
    */
    checkMailExistenceInDb = (signUpData, callback) => {
        const email = signUpData.email;
        User.find({ email: `${email}` }, (error, userExistence) => {
            (error) ? callback(error, null) : callback(null, userExistence);
        });
    }
}

module.exports = new UserModel;
