/**
 * @module       middlewares
 * @description  This file contain Helper class which is having methods related to
 *               auhorization token creation and sending the mails to users
 * @requires     nodemailer module for sending the mail to user
 * @requires     logger is a reference to save logs in log files
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
------------------------------------------------------------------------------------------*/

const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const redis = require('redis');
const logger = require('../../config/logger');
const bookValidation = require('./bookValidation');
const resposnsCode = require('../../util/staticFile.json');

const client = redis.createClient();

class Helper {
    /**
      * @description verify the user to authorized user's role
      * @param {*} req get request from middlewre
      * @param {*} res sends response to client
      * @param {*} next allow to move forward if everything is working fine
      */
    addRole = (role) => (req, res, next) => {
        req.role = role;
        next();
    };

    /**
     * @description it genrate the token
     */
    genrateToken = (user) => {
        const token = jwt.sign(
            {
                email: user[0].email,
                role: user[0].role,
                userId: user[0]._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '24d',
            },
        );
        client.setex('token', 5000, token);
        return token;
    };

    validateBook = (request, response, next) => {
        const validatedRequestResult = bookValidation.validate(request.body);
        if (validatedRequestResult.error) {
            logger.error('SCHEMAERROR: Request did not match with schema');
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: validatedRequestResult.error.details[0].message,
            });
        } else {
            return next();
        }
    }

    /**
      * @description verify user role
      * @param {*} req takes token from header
      * @param {*} res sends response
      * @param {*} next allow to move forward if everything is working fine
      */
    verifyRole = (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token === undefined) {
                logger.error('Incorrect token or token is expired');
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect token or token is expired',
                });
            }
            const decodeData = jwt.verify(token, process.env.SECRET_KEY);
            client.get('token', (error, result) => {
                if (error) {
                    logger.error('error in getting token from redis', error);
                    return res.status(500).send({
                        success: false,
                        message: 'Authorization failed',
                        error,
                    });
                }
                if (token === result) {
                    if (decodeData.role != 'admin') {
                        logger.error('Authorization failed admin is only allow to do this activity');
                        return res.status(401).send({
                            success: false,
                            message: 'Authorization failed, admin is only allow to do this activity',
                        });
                    }
                    req.decodeData = decodeData;
                    next();
                }
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: `some error occured ${error}`,
            });
        }
    }

    /**
     * @description verify token authenticates user
     * @param {*} request get requested information from middleware
     * @param {*} response return response
     * @param {*} next allow to move forward if everything is working fine
     */
    verifyToken = (request, response, next) => {
        try {
            const token = request.headers.authorization.split('Bearer ')[1];
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            client.get('token', (error, result) => {
                if (error) {
                    logger.error('error in getting token from redis', error);
                    throw error;
                }
                if (token === result) {
                    request.userData = decode;
                    next();
                }
            });
        } catch (error) {
            logger.error('Authorization failed');
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: 'Authentication failed',
            });
        }
    };

    /*
     * @description this function sending mail for reset password
     */
    sendMailToResetPassword = async (user, token, callback) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: process.env.PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await ejs.renderFile(
            'app/views/forgotPassword.ejs',
            {
                name: user.firstName,
                resetLink: `${process.env.CLIENT_URL}/resetpassword/${token}`,
            },
            (err, data) => {
                if (err) {
                    logger.error(err);
                } else {
                    const mainOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: 'Reset Password',
                        html: data,
                    };
                    transporter.sendMail(mainOptions, (error, mailInfo) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            mailInfo = `${process.env.CLIENT_URL}/resetpassword/${token}`;
                            callback(null, mailInfo);
                        }
                    });
                }
            },
        );
    };
}

module.exports = new Helper();
