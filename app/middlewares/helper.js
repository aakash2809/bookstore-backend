const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../../config/logger");

class Helper {
    /**
      * @description verify the user to authorized user's role
      * @param {*} req
      * @param {*} res
      * @param {*} next
      */
    addRole = (role) => {
        return (req, res, next) => {
            req.role = role;
            next();
        }
    };

    /**
     * @description it genrate the token
     */
    genrateToken = (user) => {
        console.log("token genration input: ", user);
        return jwt.sign(
            {
                email: user[0].email,
                role: user[0].role,
                userId: user[0]._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "24d",
            }
        );
    };
    /**
      * @description verify user role 
      * @param {*} req takes token from header
      * @param {*} res sends response 
      * @param {*} next 
      */
    verifyRole = (req, res, next) => {
        console.log("helper");
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (token === undefined) {
                logger.error('Incorrect token or token is expired');
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect token or token is expired'
                });
            }
            return jwt.verify(token, process.env.SECRET_KEY, (error, decodeData) => {
                if (error) {
                    logger.error('Incorrect token or token is expired');
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect token or token is expiredd ',
                        error
                    });
                } else if (decodeData.role != 'admin') {
                    console.log("helper", decodeData.role);
                    logger.error('Authorization failed');
                    return res.status(401).send({
                        success: false,
                        message: 'Authorization failed'
                    });
                }
                req.decodeData = decodeData;
                next();
            });
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: 'some error occured ' + error
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
            const token = req.headers.authorization.split(" ")[1];
            if (token === undefined) {
                logger.error('Incorrect token or token is expired');
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect token or token is expired'
                });
            }
            return jwt.verify(token, process.env.SECRET_KEY, (error, decodeData) => {
                if (error) {
                    logger.error('Incorrect token or token is expired');
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect token or token is expired'
                    });
                }
                req.decodeData = decodeData;
                next();
            });
        } catch {
            return res.status(401).send({
                success: false,
                message: 'some error occured'
            });
        }
    }
}

module.exports = new Helper();
