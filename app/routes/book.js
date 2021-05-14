/**
 * @module       routes
 * @file         book.js
 * @description  provide the routes for user as well note operations and middleware inpu vallidations
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>      
-----------------------------------------------------------------------------------------------*/
const book = require('../controllers/book.js');
const helper = require("../middlewares/helper");
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

class BookRoutes {
    routeToUserController = (app) => {

        //add new book , helper.validateBook
        //app.post('/book', helper.verifyRole, book.addBook);
        app.post('/book', helper.verifyRole, upload.single('avatar'), book.addBook);

        //get all books from db
        app.get('/books', book.findAllBooks);

        //update a book by id
        app.put('/book/:bookId', helper.verifyToken, helper.validateBook, book.update);

        //delete a book by id
        app.delete('/deleteBook/:bookId', helper.verifyToken, book.delete);

        //add to bag book by id
        app.put('/book/addtobag/:bookId', helper.verifyToken, book.addToBag);

        //remove from bag by id
        app.put('/book/removeFromBag/:bookId', helper.verifyToken, book.removeFromBag);
    };
}

module.exports = new BookRoutes();