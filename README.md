# Assignment 2 - Web API - Automated development process.

Name: Zonghao Li

## Overview.
Users.js can add and delete users, get user information, recommend books, like favorite books and unlike it, filter and arrange books according to likes.
Books.js can add and delete books, get information about books, give a summary to writing, clear all reviews on a book, and so on.

## API endpoints.
+ GET /books - get all books.
+ GET /books/id=:id - Get a BOOK by ID.
+ GET /books/name=:name - Get a BOOK by NAME.
+ GET /users/id=:id - Get an USER by ID.
+ GET /users/acc=:account - Get an USER by ACCOUNT.
+ GET /books/like=:like - Get all books whose likes are greater or equal to the input number.
+ GET /users/findreview=:id - Get all reviews of the book that the input user has recommended.
+ GET /users/rank - Get all books in descending order.

+ PUT /users/like=:id - Set an user like a book
+ PUT /users/unlike=:id - Set an user unlike a book
+ PUT /books/writeSummary=:id - Write a summary to a book
+ PUT /books/clearReview=:id - Clear a book's all reviews
+ PUT /users/recommende=:id - Make an user like a book and write a review to it.

+ POST /books/addBook - add a book
+ POST /users/addUser - add an user

+ DELETE /books/id=:id - delete a book by object id
+ DELETE /books/name=:bookname - delete a book by name
+ DELETE /users/id=:id - delete an user by object id
+ DELETE /users/acc=:account - delete a book by object id

## Continuous Integration and Test results.

. . . URL of the Travis build page for web API

https://travis-ci.org/albertlee000/assignment2


. . . URL of published test coverage results on Coveralls

https://coveralls.io/github/albertlee000/BookCommunity


## Extra features.
. . . . Briefly state any extra features of your server-side submission for assignment 2 thst you feel should be high-lighted . . . . .
