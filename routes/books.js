let Book = require('../models/books');
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
//find books by name
router.findBookByName = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    Book.find({"name": {$regex: req.params.name, $options:'i'}},function(err, book) {
        if (err)
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
//get all books' recommendeds
router.getRecommends = (req,res)=>{
    res.setHeader('Content-Type','application/json');

    //find all books that their recommendes  are bigger or equal to requested value
    Book.find({ "recommended" : {"$gte":req.params.recommended} },function(err,book) {

        res.send(JSON.stringify(book,null,5));
    });

}
//delete book by id
router.deleteByID = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //make sure book deleted
    Book.findOneAndRemove({ "_id" : req.params.id },function(err) {
        if (err)
            res.json({ message: 'Book No.' + req.params.id + ' delete failed!'});
        else
            res.json({ message: 'Book No.' + req.params.id + ' delete successully!'});
    });
}
//add a new book
router.addBook = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var book = new Book();
    book._id = req.body.id;
    book.name = req.body.name;
    book.recommended = req.body.recommended;
    book.save();
    Book.find({ "_id" : req.body.id },function(err, book) {
        if (err)
            res.json({ message: 'Book NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Book Successfully Added!', data: book });
    });

}
//increase recommended
router.increaseRecommended = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.findById(req.params.id , function(err,book) {
        if (err)
            res.send({message:'Book NOT Found!'});
        else {
            book.recommended += 1;
            book.save(function (err) {
                if (err)
                    res.send('Recommended NOT Successful!');
                else
                    res.send('Recommended successfully!');
            });
        }
    });
}
//cancel recommended
router.cancelRecommended = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var canCancel = false;
    //make sure recommended can be cancelled
    Book.findById(req.params.id , function(err,book) {
        if(book.recommended>0){
            canCancel = true;
        }
    });
    Book.findById(req.params.id , function(err,book) {
        if(canCancel == true){
            book.recommended -= 1;
            book.save(function (err) {
                if (err)
                    res.send('Cannot cancel recommended!');
                else
                    res.send('recommended cancelled!');
            })
        }
        else
            res.send('You have not recomended!')
    });
}
//write books' reviews
router.writeReview = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.findByIdAndUpdate(req.params.id, {$set:{review:req.body.review}}, function(err){
        if (err)
            res.send('Review wrote failed...');
        else
            res.send('Review wrote successfully!!');
    })
}
router.cancelReview = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.findByIdAndUpdate(req.params.id, {$set:{review:""}}, function(err){
        if (err)
            res.send('Review canceled failed...');
        else
            res.send('Review cancel successfully!!');
    })
}
module.exports = router;