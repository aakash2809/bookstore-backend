const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const logger = require('../../config/logger');
const bookValidation = require('./bookValidation');
const resposnsCode = require('../../util/staticFile.json');
// var storage;
// var upload ;
class Helper {
    /* storage =   multer.diskStorage({
       destination: function (req, file, callback) {
         callback(null, './uploads');
       },
       filename: function (req, file, callback) {
         callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
       }
     });
      upload = multer({ storage : storage}).single('fileUpload'); */

    /**
      * @description verify the user to authorized user's role
      * @param {*} req
      * @param {*} res
      * @param {*} next
      */
    addRole = (role) => (req, res, next) => {
        req.role = role;
        next();
    };

    /**
     * @description it genrate the token
     */
    genrateToken = (user) => jwt.sign(
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
      * @param {*} next
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
            return jwt.verify(token, process.env.SECRET_KEY, (error, decodeData) => {
                if (error) {
                    logger.error('Incorrect token or token is expired');
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect token or token is expiredd ',
                        error,
                    });
                } if (decodeData.role != 'admin') {
                    logger.error('Authorization failed');
                    return res.status(401).send({
                        success: false,
                        message: 'Authorization failed',
                    });
                }
                req.decodeData = decodeData;
                next();
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
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    verifyToken = (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token === undefined) {
                logger.error('Incorrect token or token is expired');
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect token or token is expired',
                });
            }
            return jwt.verify(token, process.env.SECRET_KEY, (error, decodeData) => {
                if (error) {
                    logger.error('Incorrect token or token is expired');
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect token or token is expired',
                    });
                }
                req.decodeData = decodeData;
                next();
            });
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: error,
            });
        }
    }

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
