import Book from '../models/books';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

var mongodbUri ='mongodb://lzh97:brager9716@ds125693.mlab.com:25693/book';
mongoose.connect(mongodbUri);
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});
//accurate search by id
function getByID(array, id) {
    var result  = array.filter(function(book){
        return book.id == id;
    });
    return result ? result[0] : null;
}
//fuzzy search
function getByName(array, surname) {
    var reg = new RegExp(surname, "i");
    var result = array.filter(function(book){
        return book.name.match(reg);
    });
    return result ? result : null;
}
//find all books
router.findAllBooks = (req, res) => {
    res.setHeader('Content-Type','application/json');
    Book.find(function(err, book) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(book,null,5));
    });
}
//find books by name (fuzzy search)
router.findBookByName = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    Book.find({"name": {$regex: req.params.name, $options:'i'}},function(err, book) {
        if (err||book.length==0)
            res.send({Message: 'Sorry! Can\' find this book by name!'});
        else
            res.send(JSON.stringify(book,null,5));
    });
}
//find books by id
router.findBookByID = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    Book.find({ "_id" : req.params.id },function(err, book) {
        if (err)
            res.send({Message: 'Sorry! Can\' find this book by ID!'});
        else
            res.send(JSON.stringify(book,null,5));
    });
}
//find all books whose likes are greater than the input number
router.findBookByLike = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //find all books that their likes  are bigger or equal to requested value
    Book.find({ "like" : {"$gte":req.params.like} },function(err,book) {
        if(err||book.length==0)
            res.send({message:'Sorry, cannot find any book has higher likes'})
        else
            res.send(JSON.stringify(book,null,5));
    });

}

//delete book by id
router.deleteBookByID = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //make sure book deleted
    Book.findOneAndRemove({ "_id" : req.params.id },function(err,data) {
        if (err||data == null)
            res.json({ message: 'Book No.' + req.params.id + ' delete failed!'});
        else
            res.json({ message: 'Book No.' + req.params.id + ' delete successully!'});
    });
}
//delete book by id
router.deleteBookByName = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //make sure book deleted
    Book.findOneAndRemove({ "name" : req.params.bookname },function(err,data) {
        if (err||data == null)
            res.json({ message: 'Book [' + req.params.bookname + '] delete failed!'});
        else
            res.json({ message: 'Book [' + req.params.bookname + '] delete successully!'});
    });
}
//add a new book
router.addBook = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var book = new Book();
    book.name = req.body.bookname;
    book.author = req.body.author;
    book.review = req.body.review;
    book.summary = req.body.summary;
    book.save(function(err) {
        if (err)
            res.json({message: 'Book NOT Added!'});
        else
            res.json({message: 'Book Successfully Added!'});

    });

}


//write book's sumary
router.writeSummary = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.findByIdAndUpdate(req.params.id, {$set:{summary:req.body.summary}}, function(err){
        if (err)
            res.send({message:'Summary wrote failed...'});
        else
            res.send({message:'Summary wrote successfully!!'});
    })
}
//clear a book's all reviews
router.clearReview = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.findByIdAndUpdate(req.params.id, {$set:{review:""}}, function(err){
        if (err)
            res.send({message:'Reviews clear failed...'});
        else
            res.send({message:'Reviews clear successfully!!'});
    })
}
module.exports = router;
