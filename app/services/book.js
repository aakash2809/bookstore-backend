/**
 * @module       services
 * @file         book.js
 * @description  service class holds all logical methods related to book operations
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>   
-----------------------------------------------------------------------------------------------*/

const bookModel = require('../models/book');

class Bookservice {

    /**
     * @description calling model class method to add new book to book store
     * @method save is model class method
     * @param {*} bookData holds book information
     * @param {*} callback is for controller class methods
     * @returns callback function
     */
    addBook = (bookData, callback) => {
        return bookModel.save(bookData, (error, data) => {
            (error) ? callback(error, null) : callback(null, data);
        });
    }


    /**
     * @description add new book to bookstore
     * @method getBooks is a model class method
     * @param userId contains admin information
     * @param {*} callback is for controller class methods
     */
    getBooks = (userId, callback) => {
        bookModel.getBooks(userId, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        });
    }

    /**
     * @description update a book by id
     * @method update is model class methodholds bookdata
     * @param {*} bookData holds user input update data 
     * @param {*} callback is for controller class methods
     * @returns callback
     */
    updateBook = (bookData, callback) => {
        return bookModel.update(bookData, (error, data) => {
            return (error) ? callback(error, null) : callback(null, data);
        });
    }

    /**
     * @description delete a book by its id
     * @param {*} bookData holds user input data
     * @param {*} callback is for controller class method
     * @method delete is models class method
     * @returns callback
     */
    deleteBook = (bookData, callback) => {
        console.log("ser")
        return bookModel.delete(bookData, (error, data) => {
            console.log("sersdat", data)
            return (error) ? callback(error, null) : callback(null, data);
        })
    }

    /**
     *  @description add a book to bag by making isAddedToBag flag true
     * @param {*} bookData 
     */
    addToBag = async (bookData) => {
    }
}

module.exports = new Bookservice();