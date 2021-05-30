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

        default: ""
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
    },

    {
        autoIndex: false
    }
);

userSchema.set('versionKey', false);

userSchema.pre("save", async function (next) {
    console.log("pre save", this.password == '');
    if (!(this.password == undefined || this.password == null || this.password == '')) {
        this.password = await bycrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
        next();
    } else {
        next();
    }
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

    /**
      * @description find email id in database and validate
      * @param {*} loginCredential holds login credentials
      * @param {*} callback holds a function 
     */
    getDetailOfGivenEmailId = (loginCredential, callback) => {
        const email = loginCredential.email;
        User.find({ email: `${email}` }, (error, loginResult) => {
            (error) ? callback(error, null) : callback(null, loginResult);
        });
    }

    /**
    * @description find email id in database and 
    * callback with user data or error
    * @param {*} email holds email id
    * @param {*} callback holds a function 
   */
    forgetPassword = (email, callback) => {
        User.find(email, (error, user) => {
            (error) ? callback(error, null) : callback(null, user);
        });
    }

    async socialLogin(userData) {
        console.log("inside services", userData);
        return await User.findOne({ 'email': userData.email }).then(data => {
            console.log("model result", data);
            if (data !== null) {
                return data
            } else {
                const data = new User({
                    'firstName': userData.firstName,
                    'lastName': userData.lastName,
                    'email': userData.email,
                });
                return data.save();
            }
        }).catch(err => {
            return ('Something went wrong', err);
        });
    };
}

module.exports = new UserModel;
