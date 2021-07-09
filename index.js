/**
* @file          index.js
* @description   This file contains all socket activity for realtime communication
* @requires      logger is a reference to save logs in log files
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*--------------------------------------------------------------------------------------*/
const express = require('express');
const axios = require('axios');
const socket = require('socket.io');
const logger = require('./config/logger');

const app = express();
const baseUrl = 'http://localhost:2000';

app.use(express.static(__dirname + '/public/'));

// listen for request
const server = app.listen(4000, () => {
    logger.info('Connected, server started listening on port :', 4000);
});

const io = socket(server);

/**
  * @description this function takes books cost ranges as a parameter and
  * returns number of books, corrousponding ranges
  * @param {*} payload contains the books cost ranges
  */
let getData = (payload) => {
    return axios.post(`${baseUrl}/books/filter/byRange`, payload);
};

/**
 * @description establish connection with client, emit response as per
 * requested event by client
 */
io.on('connection', (socket) => {
    logger.info('connected with soket');
    socket.on('range', async (payload) => {
        let result = [];
        result = await getData(payload);
        socket.emit('range', result.data.data);
    });
});
