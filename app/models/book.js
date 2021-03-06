/**
 * @module       models
 * @file         book.js
 * @description  models class holds all database operation and couchbase queries
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>
-----------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        author: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            unique: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value',
            },
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isAddedToBag: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

bookSchema.set('versionKey', false);

const Book = mongoose.model('Book', bookSchema);

class BookModel {
    /**
     * @description saving book into buckets
     * @param {*} bookData holds user input data
     * @param {*} callback is for service class method
     */
    save = async (bookData, callback) => {
        const book = new Book(bookData);
        await book.save((error, bookResult) => {
            error ? callback(error, null) : callback(null, bookResult);
        });
    }

    /**
     * @description get all books from database
     * @param {*} callback is for service class holds error and user
     */
    getBooks = async (callback) => {
        await Book.find({}, (error, noteData) => {
            error ? callback(error, null) : callback(null, noteData);
        });
    }

    /**
     * @description update a book
     * @param {*} bookData
     * @param {*} callback
     */
    update = async (bookData, callback) => {
        const { bookId } = bookData;
        await Book.findByIdAndUpdate(
            bookId,
            bookData,
            { new: true },
            (error, noteResult) => {
                error ? callback(error, null) : callback(null, noteResult);
            },
        );
    }

    /**
     * @description delete a book
     * @param {*} bookData
     * @param {*} callback
     * @returns data of remove method
     */
    delete = (bookData, callback) => {
        Book.findByIdAndDelete(bookData.bookId, (error, bookResult) => {
            error ? callback(error, null) : callback(null, bookResult);
        });
    }

    /**
     * @description add a book to bag by making isAddedToBag flag to true
     * @param {*} userData
     */
    addToBag = async (userData) => await Book.findByIdAndUpdate(
        userData.bookId, { isAddedToBag: true }, { new: true },
    )

    /**
   * @description add a book to bag by making isAddedToBag flag to false
   * @param {*} userData
   */
    removeFromBag = async (userData) => await Book.findByIdAndUpdate(
        userData.bookId, { isAddedToBag: false }, { new: true },
    )

    /**
      * @description retrive all note data from database in between given range
      *@param {*} booksCostRange contain minimum and maximum range
      */
    filterBooks = async (booksCostRange) => {
        try {
            let minPrice = booksCostRange.min;
            let maxPrice = booksCostRange.max;
            const result = await Book.find({ price: { $lte: maxPrice, $gte: minPrice } }).count();
            return result;
        } catch (error) {
            return error;
        }
    };

    /**
      * @description this uses aggregate function to find number of books and
      *  titles and author name
      */
    findBooksCountByAuthor = async () => {
        try {
            const result = await Book.aggregate([
                {
                    $group: { _id: '$author', Books: { $push: '$title' }, Count: { $sum: 1 } }
                },
                { $project: { Owner: '$_id', Books: '$Books', Count: '$Count', _id: 0 } }
            ]);
            return result;
        } catch (error) {
            return error;
        }
    };
}

module.exports = new BookModel();
