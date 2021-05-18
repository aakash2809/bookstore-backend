/**
 * @module       test
 * @file         test.js
 * @description  test the all routes for crud operation
 * @author       Aakash Rajak <aakashrajak2809@gmail.com> 
     ----------------------------------------------------------------------------------------------*/
let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("../../server");
let server = require("../../server");
const resposnsCode = require("../../util/staticFile.json");
chai.use(chaiHttp);
const bookData = require("./book.json");
chai.should();
const token = bookData.books.properToken.token;
const bookId = bookData.books.registeredBookId.bookId;

describe("books API", () => {

    /**
     * @description Test the GET API
     */
    describe("GET /books", () => {
        // test the GET API when points are proper
        it("givenbooks_WhenGivenProperEndPoints_ShouldReturnObject", (done) => {
            chai
                .request(server)
                .get("/books")
                .set("Authorization", token)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    done();
                });
        });

        // test the GET API when points are not proper
        it("givenbooks_WhenNotGivenProperEndPoints_ShouldNotReturnObject", (done) => {
            chai
                .request(server)
                .get("/wrongEndPoint")
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    /**
     * @description Test the POST API
     */
    describe("POST /book", () => {
        // test the POST API when provided proper data
        it("givenbooks_WhenGivenPropertitleAnddescription_ShouldPostbook", (done) => {
            const book = bookData.books.bookToPost;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("givenbooks_WhenNotGivenQuantityAndPriceInInteger_ShouldNotPostbook", (done) => {
            const book = bookData.books.bookWithoutIntegerValueForPrice;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((req, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("givenbooks_WhenNotGivenQuantityAndPriceInInteger_ShouldNotPostbook", (done) => {
            const book = bookData.books.bookWithoutIntegerValueForQuantity;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((error, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"quantity" must be a number');
                    res.body.should.be.a("object");
                    done();
                });
        });

        it("givenbooks_WhenGivenNotPropertitleAnddescription_ShouldNotPostbook", (done) => {
            const book = bookData.books.invalidbookToPost;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((error, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"description" length must be at least 6 characters long');
                    done();
                });
        });

        // test the POST API when provided improper data
        it("givenbooks_WhenNotGivenPropertitleAndDescription_ShouldNotPostbook", (done) => {
            const book = bookData.books.bookWithouttitle;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"title" is required');
                    done();
                });
        });

        it("givenbooks_WhenNotGivenDescription_ShouldNotPostbook", (done) => {
            const book = bookData.books.bookWithoutDescription;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"description" is required');
                    done();
                });
        });

        it("givenbooks_WhenGivenEmptyTitle_ShouldNotPostbook", (done) => {
            const book = bookData.books.bookWithEmptyTitle;
            chai
                .request(server)
                .post("/book/")
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"title" is not allowed to be empty');
                    done();
                });
        });
    });

    /**
     * @description Test the PUT API using Id
     */
    describe("/PUT  /book/:bookId", () => {
        // test the PUT API when provided proper Id
        it.skip("givenbooks_WhenGivenProperId_ShouldUpdatebook", (done) => {
            const book = bookData.books.bookToUpdate;
            chai
                .request(server)
                .put(`/book/${bookId}`)
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.SUCCESS);
                    res.body.message.should.have.equal('book updated successfully !');
                    res.body.should.be.a("Object");
                    done();
                });
        });

        // test the PUT API when provided improper Id
        it("givenbooks_WhenGivenImropertitle_ShouldNotUpdatebook", (done) => {
            const book = bookData.books.bookWithouttitle;
            chai
                .request(server)
                .put(`/book/${bookId}`)
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"title" is required');
                    res.body.should.be.a("Object");
                    done();
                });
        });

        it("givenbooks_WhenGivenImropertitle_ShouldNotUpdatebook", (done) => {
            const book = bookData.books.bookWithEmptyTitle;
            chai
                .request(server)
                .put(`/book/${bookId}`)
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.message.should.have.equal('"title" is not allowed to be empty');
                    res.body.should.be.a("Object");
                    done();
                });
        });

        it("givenbooks_WhenGivenImroperdescription_ShouldNotUpdatebook", (done) => {
            const book = bookData.books.bookWithImproperDescription;
            chai
                .request(server)
                .put("/book/" + bookId)
                .set("Authorization", token)
                .send(book)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.BAD_REQUEST);
                    res.body.should.be.a("Object");
                    done();
                });
        });
    });

    describe("/PUT  /book/addtobag/:bookId", () => {
        it.skip("givenbook_WhenGivenProperbookId_ShouldaddbookToBag", (done) => {
            chai
                .request(server)
                .put("/book/addtobag/" + bookId)
                .set("Authorization", token)
                .send(bookId)
                .end((err, res) => {
                    res.body.status.should.have.equal(resposnsCode.SUCCESS);
                    res.body.message.should.have.equal(' added to bag successfully !');
                    res.body.should.be.a("Object");
                    done();
                });
        });
    });

    describe("DELETE /deleteBook/bookId", function () {
        it("givenbooks_WhenGivenProperId_ShouldDelete_book", (done) => {
            chai
                .request(server)
                .delete("/deleteBook/" + bookId)
                .set("Authorization", token)
                .end((err, res) => {
                    res.body.status_code.should.have.equal(resposnsCode.SUCCESS);
                    res.body.message.should.have.equal('book deleted successfully!');
                    done();
                });
        });
    });
});
