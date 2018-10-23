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
                    .get('/users/acc=wings')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(1);
                        let result = _.map(res.body, (user) => {
                            return { acc: user.account,
                                psw: user.psw }
                        });
                        expect(result).to.include( { acc: 'wings', psw: 'gsd' } );
                        done();
                    });
            });
        });
    });
    describe('POST /users/addUser', function () {
        it('should return confirmation message and update datastore that add successfully', function(done) {
            let user = {
                account: 'lzh',
                psw: '123456',
                email: 'jjj@qq.com',

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
                .get('/users/acc=lzh')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return {
                            account: user.account,
                            psw: user.psw,
                            email: user.email,
                        };
                    });
                    expect(result).to.include( { account: 'lzh', psw: '123456',email:'jjj@qq.com'  } );
                    done();
                });
        });
    });
    describe('PUTT /users/like=:id', function () {
        it('should return confirmation message and update datastore that add successfully', function(done) {
            let user = {
                account: 'lzh',
                psw: '123456',
                email: 'jjj@qq.com',

            };
            chai.request(server)
                .post('/users/like=:id')
                .send(user)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User created successfully!' );
                    done();
                });
        });
        after(function (done) {
            chai.request(server)
                .get('/users/acc=lzh')
                .end(function(err, res) {
                    let result = _.map(res.body, (user) => {
                        return {
                            account: user.account,
                            psw: user.psw,
                            email: user.email,
                        };
                    });
                    expect(result).to.include( { account: 'lzh', psw: '123456',email:'jjj@qq.com'  } );
                    done();
                });
        });
    });
});