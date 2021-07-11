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

let costRangesSamples = require("./testsample.json");

describe('Suite of unit tests', () => {
    var socket;
    beforeEach(function () {
        // Setup
        socket = io(process.env.SOCKET_URL);
    });

    describe('test', () => {
        it('should send payload and receive object from db', (done) => {
            socket.emit('range', costRangesSamples.booksCostRanges);
            socket.on('range', (result) => {
                result.should.be.a('Object');
                done();
            });
        });

        it("WhenGivenRangeMinValueMissing_shouldReturn_successFalse", (done) => {
            socket.emit('range', costRangesSamples.costRangesWithoutMin);
            socket.on('range', (result) => {
                result.success.should.have.equal(false);
                result.message.should.have.equal('"[0].min" is required');
                done();
            });
        });

        it("WhenGivenRangeMaxValueMissing_shouldReturn_successFalse", (done) => {
            socket.emit('range', costRangesSamples.costRangesWithoutMax);
            socket.on('range', (result) => {
                result.success.should.have.equal(false);
                result.message.should.have.equal('"[1].max" is required');
                done();
            });
        });

        it("WhenGivenRangIsSingleObjectWithoutArray_shouldReturn_successFalse", (done) => {
            socket.emit('range', costRangesSamples.singleObjectOfCostRange);
            socket.on('range', (result) => {
                result.success.should.have.equal(false);
                result.message.should.have.equal('"value" must be an array');
                done();
            });
        });
    });
});