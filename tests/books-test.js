let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let expect = chai.expect;
let datastore = require('../models/users');
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );
describe('Users', function (){

    describe('Users', function (){
        describe('GET /users/id=:id', () => {
            it('should return an user by id', function(done) {
                chai.request(server)
                    .get('/users/id=5bce50fc6436e42a00965e48')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(1);
                        let result = _.map(res.body, (user) => {
                            return { acc: user.account,
                                psw: user.psw }
                        });
                        expect(result).to.include( { acc: 'yyf', psw: 'qwe' } );
                        done();
                    });
            });
        });
    });
    describe('Users', function (){
        describe('GET /users/acc=:account', () => {
            it('should return an user by account', function(done) {
                chai.request(server)
                    .get('/users/acc=lgd')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(1);
                        let result = _.map(res.body, (user) => {
                            return { acc: user.account,
                                psw: user.psw }
                        });
                        expect(result).to.include( { acc: 'lgd', psw: 'asdasda' } );
                        done();
                    });
            });
        });
    });
    describe('POST /users/addUser', function () {
        it('should return confirmation message and update datastore that add successfully', function(done) {
            let user = {
                account: 'albert',
                psw: '123456',
                email: 'aaa@qq.com',
            };
            chai.request(server)
                .post('/users/addUser')
                .send(user)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User created successfully!' );
                    done();
                });
        });
        after(function (done) {
            chai.request(server)
                .get('/users/acc=albert')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return {
                            account: user.account,
                            psw: user.psw,
                            email: user.email,
                        };
                    });
                    expect(result).to.include( { account: 'albert', psw: '123456',email:'aaa@qq.com'  } );
                    done();
                });
        });
        it('should return a failed message for creating user failed', function(done) {
            let user = {
                account: 'albert',
                psw: '123456',
                email: 'aaa@qq.com',
            };
            chai.request(server)
                .post('/users/addUser')
                .send(user)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User created failed...' );
                    done();
                });
        });
    });
    describe('DELETE /users/acc=:account', () => {
        it('should return a succcessful message and the user would be deleted by account', function(done) {
            chai.request(server)
                .delete('/users/acc=albert')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User delete successully!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/users/acc=albert')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return { account:user.account };
                    }  );
                    expect(result).to.not.include( { account:'albert'  } );
                    done();
                });
        });
        it('should return a failed message for deleting user failed', function(done) {
            chai.request(server)
                .delete('/users/acc=albert')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User delete failed!' );
                    done();
                });
        });
    });
    describe('PUT /users/like=:id', function () {
        it('should return a message and update datastore that user likes the book', function(done) {
            let bookname = {bookname:'you'};
            chai.request(server)
                .put('/users/like=5bce50fc6436e42a00965e48')
                .send(bookname)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('You liked this book' );
                    done();
                });
        });


    });
    describe('PUT /users/unlike=:id', function () {
        it('should return a message and update datastore that user unlikes the book', function(done) {
            let bookname = {bookname:'you'};
            chai.request(server)
                .put('/users/unlike=5bce50fc6436e42a00965e48')
                .send(bookname)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('You unliked this book');
                    done();
                });
        });
    });
    describe('PUT /users/recommende=:id', function () {
        it('should return a message and update datastore that user recommended a book and add a review to the book', function(done) {
            let recommendation = {
                bookname: 'me' ,
                id: '5bce51756436e42a00965e4e',
                review: 'an amazing book'
            };
            chai.request(server)
                .put('/users/recommende=5bce51096436e42a00965e49')
                .send(recommendation)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('You recommended [me]');
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books/id=5bce51756436e42a00965e4e')
                .end(function(err, res) {
                    let result = _.map(res.body, (book) => {
                        return { content:book.review[2].content,
                            reviewer:book.review[2].reviewer};
                    }  );

                    expect(result).to.include( { content: 'an amazing book', reviewer: 'nb'  } );
                    done();
                });
        });
        it('should return a message that recommende failed', function(done) {
            let recommendation = {
                bookname: 'me' ,
                id: '5bce51756436e42a00965e4e',
                review: 'an amazing book'
            };
            chai.request(server)
                .put('/users/recommende=11255')
                .send(recommendation)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Sorry! Please try it again!');
                    done();
                });
        });
    });

});