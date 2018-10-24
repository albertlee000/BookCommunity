var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const books = require("./routes/books");
const users = require("./routes/users");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/books', books.findAllBooks);
app.get('/books/id=:id', books.findBookByID);//find BOOK by ID
app.get('/books/name=:name', books.findBookByName);//find BOOK by NAME
app.get('/users/id=:id', users.findUserByID);//find USER by ID
app.get('/users/acc=:account', users.findUserByAccount);//find USER by ACCOUNT
app.get('/books/like=:like',books.findBookByLike);
app.get('/users/findreview=:id',users.findOnesReviews);
app.get('/users/rank',users.rankBookByLikes);

app.post('/books/addBook',books.addBook);//ADD BOOKS
app.post('/users/addUser',users.addUser);//ADD USERS

app.put('/users/like=:id',users.increaseLike);
app.put('/users/unlike=:id',users.cancelLike);
app.put('/books/writeSummary=:id',books.writeSummary);
app.put('/books/cancelReview=:id',books.cancelReview);
app.put('/users/recommende=:id',users.Recommende);

app.delete('/books/id=:id',books.deleteBookByID);
app.delete('/books/name=:bookname',books.deleteBookByName);
app.delete('/users/id=:id',users.deleteUserByID);
app.delete('/users/acc=:account',users.deleteUserByAccount);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
