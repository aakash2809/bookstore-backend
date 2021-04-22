/**
 * @module       controllers
 * @file         book.js
 * @description  controller class holds request and sends response 
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>       
-----------------------------------------------------------------------------------------------*/

const bookService = require('../services/book.js');
const resposnsCode = require("../../util/staticFile.json");
const logger = require("../../config/logger");

class BookController {

    /**
     * @description add new book to book-store
     * @method addBook is a service class method
     * @param {req, res}
     */
    addBook = (req, res) => {
        try {
            const bookData = {
                author: req.body.author,
                title: req.body.title,
                quantity: req.body.quantity,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image,
                adminId: req.decodeData.userId
            }
            bookService.addBook(bookData)
                .then((data) => {
                    logger.info("Book added successfully !"),
                        res.send({
                            status: resposnsCode.SUCCESS,
                            message: "Book added successfully !",
                            data: data,
                        });
                })
                .catch((error) => {
                    logger.error("Some error occurred while creating Book", +error),
                        res.send({
                            status: resposnsCode.Internal_Server_Error,
                            message: "Some error occurred while creating Book",
                        });
                });
        } catch (error) {
            logger.error("Some error occurred while creating Book"),
                res.send({
                    status: resposnsCode.Internal_Server_Error,
                    message: "Some error occurred while creating Book" + error,
                });
        }
    }

    /**
     * @description find all books in database
     * @method getBooks is service class method 
     * @param {*} req holds user input
     * @param {*} res sends responce with data coming from Database
     */
    findAllBooks = (req, res) => {
        try {
            const userId = req.decodeData.userId;
            bookService.getBooks(userId, (error, data) => {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: error.message
                    });
                } else if (data.length == 0) {
                    logger.error('Books not found');
                    return res.status(404).send({
                        success: false,
                        message: 'Books not found'
                    });
                }
                logger.info('Successfully retrieved books !');
                return res.status(200).send({
                    success: true,
                    message: 'Successfully retrieved books !',
                    data: data
                });
            });
        } catch (error) {
            logger.error('Some error occurred !');
            res.status(500).send({
                success: false,
                message: 'Some error occurred !' + error
            });
        }
    }


    /**
     *
     * @description update book in database
     * @method update is service class method
     * @param res is used to send the response
     */
    update = (req, res) => {
        try {
            const bookDetail = {
                bookId: req.params.bookId,
                author: req.body.author,
                title: req.body.title,
                image: req.body.image,
                quantity: req.body.quantity,
                price: req.body.price,
                description: req.body.description,
                adminId: req.decodeData.userId,
            };
            bookService.updateBook(bookDetail, (error, data) => {
                return (
                    error ?
                        (logger.error("Error updating book with id : " + req.params.bookId),
                            res.send({
                                status_code: resposnsCode.INTERNAL_SERVER_ERROR,
                                message: "Error updating book with id : " + req.params.bookId + error,
                            })) :
                        !data ?
                            (logger.warn("book not found with id : " + req.params.bookId + error),
                                res.send({
                                    status_code: resposnsCode.Not_Found,
                                    message: "book not found with id : " + req.params.bookId + error,
                                })) :
                            logger.info("book updated successfully !"),
                    res.send({
                        status_code: resposnsCode.SUCCESS,
                        message: "book updated successfully !",
                        data: data,
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" ?
                    (logger.error("book not found with id " + error + req.params.bookId),
                        res.send({
                            status_code: resposnsCode.Not_Found,
                            message: "book not found with id " + error + req.params.bookId,
                        })) :
                    logger.error("Error updating book with id " + error + req.params.bookId),
                res.send({
                    status_code: resposnsCode.Internal_Server_Error,
                    message: "Error updating book with id " + error + req.params.bookId,
                })
            );
        }
    };

    /**
     * @description delete book with id
     * @method delete is service class method
     * @param response is used to send the response
     */

    delete(req, res) {
        try {
            const bookData = {
                bookId: req.params.bookId,
                adminId: req.decodeData.userId
            };
            bookService.deleteBook(bookData, (error, data) => {

                return (
                    error ?
                        (logger.warn("book not found with id " + req.params.bookId),
                            res.send({
                                status_code: resposnsCode.SUCCESS,
                                message: "book not found with id " + req.params.bookId,
                            })) :
                        logger.info("book deleted successfully!"),
                    res.send({
                        status_code: resposnsCode.SUCCESS,
                        message: "book deleted successfully!",
                    })
                );
            });
        } catch (error) {
            return (
                error.kind === "ObjectId" || error.title === "NotFound" ?
                    (logger.error("could not found book with id" + req.params.bookId),
                        res.send({
                            status_code: resposnsCode.Not_Found,
                            message: "book not found with id " + req.params.bookId,
                        })) :
                    logger.error("Could not delete book with id " + req.params.bookId),
                res.send({
                    status_code: resposnsCode.INTERNAL_SERVER_ERROR,
                    message: "Could not delete book with id " + req.params.bookId,
                })
            );
        }
    }

    /**
     * @description add to bag book by making isAddedToBag flag to true
     * @method addToBag is service class method holds addToBagData
     * @param {*} req 
     * @param {*} res 
     */
    addToBag = (req, res) => {
    }
}

module.exports = new BookController();