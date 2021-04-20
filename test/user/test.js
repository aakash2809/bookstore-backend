/**
 * @module       test
 * @description  test contain test.js which is having all testcases
 * @requires     chai-http is to HTTP integration testing
 * @requires     server  is to connect with server
 * @requires     testSamplesUserRegistration.json is to retrive sample object for testing
 * @author       Aakash Rajak <aakashrajak2809@gmail.com>     
-----------------------------------------------------------------------------------------------*/

const chai = require('chai');
const server = require('../../server');
const chaiHttp = require('chai-http');
const registrationSamples = require('./testSamples/registration.json');
const responseCode = require('../../util/staticFile.json');

chai.should();
chai.use(chaiHttp);

describe('Test User API', () => {

    /**
      * @description  user registration test caces
      */
    describe('POST /user-register', () => {
        it.skip('WhenGivenProperEndPointsAndCorrectInputAndNotRegistered_shouldReturn_registeredUserDetail', () => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.validUserObject2)
                .end((request, response) => {
                    response.should.have.status(responseCode.SUCCESS);
                    response.body.should.be.a('Object');
                    response.body.message.should.have.equal("account registered successfully");
                })
        })

        it("WhenRegisteredOjectPass_shouldReturn_MessageofReason ", () => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.validUserObject2)
                .end((request, response) => {
                    response.body.message.should.have.equal("Mail id already registered");
                })
        })

        it("WhenEmptyNamePass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.emptyName)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"firstName" is not allowed to be empty');
                })
            done();
        })

        it("WhenEmptyEmailPass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.emptyEmail)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"email" is not allowed to be empty');
                })
            done();
        })
        it("WhenNameHavingLessthanThreeCharPass_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.nameLengthLessThanThree)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('"firstName" is required');
                })
            done();
        })

        it("WhenPaswordAndConfirmPasswordNotSame_shouldReturn_ErrorMessageAndStatusCodeForError", (done) => {
            chai.request(server)
                .post('/user-register')
                .send(registrationSamples.passwordAndConfirmPasswordNotSame)
                .end((request, response) => {
                    response.body.status_code.should.have.equal(responseCode.BAD_REQUEST);
                    response.body.message.should.have.equal('password does not match with confirm password');
                })
            done();
        })
    })
});
