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
    addBook = async (bookData) => await bookModel.save(bookData, (error, data) => {
        (error) || data;
    })

    /**
     * @description add new book to bookstore
     * @method getBooks is a model class method
     * @param userId contains admin information
     * @param {*} callback is for controller class methods
     */
    getBooks = (callback) => {
        bookModel.getBooks((error, data) => ((error) ? callback(error, null) : callback(null, data)));
    }

    /**
     * @description update a book by id
     * @method update is model class methodholds bookdata
     * @param {*} bookData holds user input update data
     * @param {*} callback is for controller class methods
     * @returns callback
     */
    updateBook = (bookData, callback) => bookModel.update(bookData, (error, data) => ((error) ? callback(error, null) : callback(null, data)))

    /**
     * @description delete a book by its id
     * @param {*} bookData holds user input data
     * @param {*} callback is for controller class method
     * @method delete is models class method
     * @returns callback
     */
    deleteBook = (bookData, callback) => bookModel.delete(bookData, (error, data) => ((error) ? callback(error, null) : callback(null, data)))

    /**
     *  @description add a book to bag by making isAddedToBag flag true
     * @param {*} bookData
     */
    addToBag = async (bookData) => {
        const data = await bookModel.addToBag(bookData);
        return data;
    }

    /**
    *  @description add a book to bag by making isAddedToBag flag false
    * @param {*} bookData
    */
    removeFromBag = async (bookData) => {
        const data = await bookModel.removeFromBag(bookData);
        return data;
    }

    /**
     * @description call the method of note model and serve response to controller
     * @param {*} booksCostRange contains the min and max value of range by filteration has to be done
    */
    findBooks = async (booksCostRange) => {
        try {
            let result = [];
            for (let i = 0; i < booksCostRange.length; i++) {
                let booksInRange = { range: '', numberOfBooks: '' };
                booksInRange.range = `${booksCostRange[i].min}-${booksCostRange[i].max}`;
                booksInRange.numberOfBooks = await bookModel.filterBooks(booksCostRange[i]);
                result[i] = booksInRange;
            }
            return result;
        } catch (error) {
            return error;
        }
    };
}

module.exports = new Bookservice();
