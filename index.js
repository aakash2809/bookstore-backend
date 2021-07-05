const express = require('express');

const app = express();
// const bookServices = require('./app/services/book');
const bookModel = require('./app/models/book');

// listen for request
const server = app.listen(4000, () => {
    console.log(`Connected, server started listening on port :`, 4000);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('connected with soket');
    socket.on('range', async (payload) => {
        let result = [];
        console.log('got message', payload);
        let booksCostRange = [];
        booksCostRange = payload.costRange;
        for (let i = 0; i < booksCostRange.length; i++) {
            let booksInRange = { range: '', numberOfBooks: '' };
            booksInRange.range = `${booksCostRange[i].min}-${booksCostRange[i].max}`;
            booksInRange.numberOfBooks = await bookModel.filterBooks(booksCostRange[i]);
            result[i] = booksInRange;
        }
        console.log('serviceresult', result);
        socket.emit('range', result);
    });
});
