/**
 * @module       test
 * @file         test.js
 * @description  test the socket activity for realtime communication
 * @author       Aakash Rajak <aakashrajak2809@gmail.com> 
----------------------------------------------------------------------------------------------*/
var io = require('socket.io-client');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.expect();
chai.use(chaiHttp);
require('dotenv').config();
const logger = require('../../config/logger');

let costRangesSamples = require("./testsample.json");

describe('Suite of unit tests', () => {
    var socket;
    beforeEach(function () {
        // Setup
        socket = io.connect(process.env.SOCKET_URL);
        socket.on('connect', () => {
            logger.info('conncted...');
        });
    });

    describe('test', () => {
        it('should send payload and receive object from db', (done) => {

            // Set up event listener.  This is the actual test we're running
            socket.emit('range', costRangesSamples.booksCostRanges);
            let sockeResponse = socket.on('range', (result) => {
                data = result;
            });
            sockeResponse.should.be.a('Object');
            done();
        });

        it("WhenGivenRangeMinValueMissing_shouldReturn_shouldNotReturnData", (done) => {
            let data = { response: '' }
            socket.emit('range', costRangesSamples.costRangesWithoutMin);
            socket.on('range', (result) => {
                data.response = result;
            });
            data.response.should.have.equal('');
            done();
        });
    })
});