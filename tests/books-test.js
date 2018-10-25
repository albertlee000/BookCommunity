let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let expect = chai.expect;

chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );
describe('Books', function (){
    describe('GET /books', () => {
        it('should return all books infomation', function(done) {
            chai.request(server)
                .get('/books')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    done();
                });
        });
    });
    describe('GET /books/id=:id', () => {
        it('should return a book by id', function(done) {
            chai.request(server)
                .get('/books/id=5bd0d75aa0fa610ec0cc092b')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (book) => {
                        return { name: book.name,
                            author: book.author }
                    });
                    expect(result).to.include( { name: 'me', author: 'gf' } );
                    done();
                });
        });
        it('should return a message that can not find the book', function(done) {
            chai.request(server)
                .get('/books/id=dsad')
                .end(function(err, res) {
                    expect(res.body).to.have.property('Message').equal('Sorry! Can\' find this book by ID!' );
                    done();
                });
        });
    });
    describe('GET /books/name=:name', () => {
        it('should return a book by name', function(done) {
            chai.request(server)
                .get('/books/name=them')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (book) => {
                        return { name: book.name,
                            author: book.author }
                    });
                    expect(result).to.include( { name: 'them', author: 'bgg' } );
                    done();
                });
        });
        it('should return all books contain letter \'e\'', function(done) {
            chai.request(server)
                .get('/books/name=e')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(3);
                    expect(res.body[0].name).to.include('them');
                    expect(res.body[1].name).to.include('her');
                    expect(res.body[2].name).to.include('me');
                    done();
                });
        });
        it('should return a message that can not find the book by id', function(done) {
            chai.request(server)
                .get('/books/name=dsad')
                .end(function(err, res) {
                    expect(res.body).to.have.property('Message').equal( 'Sorry! Can\' find this book by name!');
                    done();
                });
        });
    });
    describe('GET /books/like=:like', () => {
        it('should return all books whose likes are greater than 50', function(done) {
            chai.request(server)
                .get('/books/like=50')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    expect(res.body[0].name).to.include('you');
                    expect(res.body[1].name).to.include('her');
                    done();
                });
        });
        it('should return no book', function(done) {
            chai.request(server)
                .get('/books/like=10000')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal( 'Sorry, cannot find any book has higher likes');
                    done();
                });
        });
    });
    describe('PUT /books/writeSummary=:id', function () {
        it('should return a successful message and update database by new summary', function(done) {
            let summary = {summary:'a legendary story'};
            chai.request(server)
                .put('/books/writeSummary=5bd0d7ffa0fa610ec0cc092d')
                .send(summary)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Summary wrote successfully!!');
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books/id=5bd0d7ffa0fa610ec0cc092d')
                .end(function(err, res) {
                    let result = _.map(res.body, (book) => {
                        return { summary:book.summary };
                    }  );
                    expect(result).to.include( { summary:'a legendary story' } );
                    done();
                });
        });
        it('should return a failed message', function(done) {
            let summary = {summary:'a legendary story'};
            chai.request(server)
                .put('/books/writeSummary=vdsfvscdf')
                .send(summary)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Summary wrote failed...');
                    done();
                });
        });
    });
    describe('POST /books/addBook', function () {
        it('should return confirmation message and update datastore that add book successfully', function(done) {
            let book = {
                bookname: 'math',
                author: 'ki'
            };
            chai.request(server)
                .post('/books/addBook')
                .send(book)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book Successfully Added!' );
                    done();
                });
        });
        after(function (done) {
            chai.request(server)
                .get('/books/name=math')
                .end(function(err, res) {
                    let result = _.map(res.body, (book) => {
                        return {
                            name: book.name,
                            author: book.author
                        };
                    });
                    expect(res).to.have.status(200);
                    expect(result).to.include( { name: 'math', author: 'ki'} );
                    done();
                });
        });
        it('should return a failed message that create book failed', function(done) {
            let book = {
                name: 'math',
                author: 'ki'
            };
            chai.request(server)
                .post('/books/addBook')
                .send(book)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book NOT Added!' );
                    done();
                });
        });
    });
    describe('DELETE /books/name=:name', () => {
        it('should return a succcessful message that book deleted successfully', function(done) {
            chai.request(server)
                .delete('/books/name=math')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book [math] delete successully!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books/name=math')
                .end(function(err, res) {
                    let result = _.map(res.body, (book) => {
                        return { name:book.name };
                    }  );
                    expect(result).to.not.include( { name:'math'  } );
                    done();
                });
        });
        it('should return a failed message that delete book failed', function(done) {
            chai.request(server)
                .delete('/books/name=math')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Book [math] delete failed!' );
                    done();
                });
        });
    });
});