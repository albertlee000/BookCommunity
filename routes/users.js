let User = require('../models/users');
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
//add users
router.addUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var user = new User();
    user.account = req.body.account;
    user.psw = req.body.psw;
    user.email = req.body.email;
    user.save(function(err, user) {
        if (err)
            res.json({ message: 'User created failed...'});
        else
            res.json({ message: 'User created successfully!'});
    });

}
//find users by id
router.findUserByID = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    User.find({ "_id" : req.params.id },function(err, user) {
        if (err)
            res.send({Message: 'Sorry! User Not Found !'});
        else
            res.send(JSON.stringify(user,null,5));
    });
}
//find users by account
router.findUserByAccount = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    User.find({ "account" : req.params.account },function(err, user) {
        if (err)
            res.send({Message: 'Sorry! User Not Found !'});
        else
            res.send(JSON.stringify(user,null,5));
    });
}
//delete users by id
router.deleteUserByID = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //make sure user deleted
    User.findOneAndRemove({ "_id" : req.params.id },function(err,data) {
        if (err||data == null)
            res.send({ message: 'User delete failed!'});
        else
            res.send({ message: 'User delete successully!'});
    });
}
//delete users by id
router.deleteUserByAccount = (req,res)=>{
    res.setHeader('Content-Type','application/json');
    //make sure user deleted
    User.findOneAndRemove({ "account" : req.params.account },function(err,data) {
        if (err||data == null)
            res.send({ message: 'User delete failed!'});
        else
            res.send({ message: 'User delete successully!'});
    });
}
//recommende books
router.Recommende = (req, res) => {
    let userId = req.params.id;
    let bookName = req.body.bookname;
    let bookId = req.body.id;
    let review = req.body.review;
    res.setHeader('Content-Type', 'application/json');
    //first time write reviews will add like once
    if(Book.find({'name':bookName}) != null){
        //add review to Book
        User.findOne({"_id":userId},function (err,user) {
            let first = true;//check if first time write review
            if (err)
                res.send({message: 'Sorry! Please try it again!'});
            else {
                for (i = 0; i < user.recommendation.length; i++) {
                    if (user.recommendation[i] == bookId) {
                        first = false;
                    }
                }
                if (first == true) {
                    Book.findOneAndUpdate({"name": bookName}, {
                        $addToSet: {
                            review: {
                                "content": review,
                                "reviewer": user.account
                            }
                        }
                    }, function (err) {});
                    Book.findOneAndUpdate({'name': bookName}, {$inc: {'like': 1}}, function (err) {});
                    User.findByIdAndUpdate(userId, {$addToSet: {like: bookName}}, function (err) {});
                }
                else {
                    Book.findOneAndUpdate({"name": bookName}, {
                        $addToSet: {
                            review: {
                                "content": review,
                                "reviewer": user.account
                            }
                        }
                    }, function (err) {});
                }
                res.send({message:'You recommended [' + bookName + ']'});
            }

        });
        User.findByIdAndUpdate(userId, {
            $addToSet: {
                recommendation:bookId

            }
        }, function (err) {})
    }
    else
        res.send({message:'Book NOT Found!'});

}
//increase like
router.increaseLike = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let canLike = true;
    let bookName = req.body.bookname;
    let id = req.params.id;
    //make sure like can be liked
    User.findById(id , function(err,user) {
        for(i = 0; i < user.like.length;i++){
            if(user.like[i] == bookName) {
                canLike = false;
            }
        }
    });
    //update usersdb and booksdb if can like this book
    Book.find({"name":bookName} , function(err) {
        if(canLike == true){
            User.update({"_id":id},{$addToSet:{like:bookName}},function (err){});
            Book.update({"name":bookName},{$inc:{'like':1}},function (err){});
            res.send({message:'You liked this book'});
        }
        else
            res.send({message:'You have liked this book, cannot like again...'})
    });
}
//cancel like
router.cancelLike = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let canCancel = false;
    let bookName = req.body.bookname;
    let id = req.params.id;
    //make sure like can be cancelled
    User.findById(id , function(err,user) {
        for(i = 0; i < user.like.length;i++){
            if(user.like[i] == bookName) {
                canCancel = true;
            }
        }
    });
    //update Userdb and Bookdb after unliked
    Book.find({"name":bookName} , function(err) {
        if(canCancel == true){
            User.update({"_id":id},{$pull:{like:bookName}},function (err){});
            Book.update({"name":bookName},{$inc:{'like':-1}},function (err){});
            res.send({message:'You unliked this book'});
        }
        else
            res.send({message:'You have not liked this book!'})
    });
}
//find all books that the user reviewed
router.findOnesReviews = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let uid = req.params.id;
    User.findOne({'_id':uid})
        .populate({path:'recommendation',select:"name author review"})
        .exec(function (err,reviews) {
            if(err)
                res.send('Sorry! Cannot find out reviews '+ err)
            else
                res.send(JSON.stringify(reviews,null,5))
        })
}
//rank all books according to likes in descending order
router.rankBookByLikes = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Book.find().sort({'like':-1}).exec(function (err,books) {
        if(err)
            res.json(err)
        else
            res.send(JSON.stringify(books,null,5))
    })
}
module.exports = router;
