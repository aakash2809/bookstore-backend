/**
 * @module       controllers
 * @description  controllers is reponsible to accept request and send the response
 *               Controller resolve the error using the service layer by invoking its services
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>      
-----------------------------------------------------------------------------------------------*/
const logger = require("../../config/logger");
const userServices = require("../services/user");
const userValidator = require("../middlewares/userValidator");
const resposnsCode = require("../../util/staticFile.json");

class UserControllers {

    /**
   * @description add user to database
   * @param {*} request in json formate
   * @param {*} response sends response from server
   */
    register = (request, response) => {
        logger.info(`TRACKED_PATH: Inside controller`);
        let validatedRequestResult = userValidator.validate(request.body);
        if (validatedRequestResult.error) {
            logger.error(`SCHEMAERROR: Request did not match with schema`);
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: validatedRequestResult.error.details[0].message,
            });
            return;
        }

        const registrationDetails = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword,
            role: request.role,
        };
        console.log("registrationDetails", registrationDetails);
        if (request.body.password != request.body.confirmPassword) {
            response.send({
                success: false,
                status_code: resposnsCode.BAD_REQUEST,
                message: "password does not match with confirm password",
            });
            return;
        }

        logger.info(`INVOKING: registerUser method of services`);
        userServices.registerUser(
            registrationDetails,
            (error, registrationResult) => {
                error
                    ? response.send({
                        success: false,
                        status_code: resposnsCode.BAD_REQUEST,
                        message: error,
                    })
                    : response.send({
                        success: registrationResult.success,
                        status_code: registrationResult.statusCode,
                        message: registrationResult.message,
                        data: registrationResult.data,
                    });
                logger.info("SUCCESS001: User registered successfully");
            }
        );
    };


}

module.exports = new UserControllers();
