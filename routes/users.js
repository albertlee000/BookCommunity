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
    user.save();
    User.find({ "account" : req.body.account },function(err, user) {
        if (err)
            res.json({ message: 'User created failed...', errmsg : err } );
        else
            res.json({ message: 'User created successfully!', data: user });
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
//recommende books
router.Recommende = (req, res) => {
    let userId = req.params.id;
    let bookName = req.body.bookname;
    res.setHeader('Content-Type', 'application/json');
    //first time write reviews will add like once
    if(Book.find({'name':bookName}) != null){
        //add review to Book
        User.findOne({"_id":userId},function (err,user) {
            let first = true;
            for(i = 0; i < user.recommendation.length;i++){
                if(user.recommendation[i].bookname == bookName)
                    first = false;
            }
            console.log(first);
            console.log(user)
            if(first == true){
                Book.findOneAndUpdate({"name":bookName}, {
                    $addToSet: {
                        review: {
                            "content": req.body.review,
                            "reviewer":user.account
                        }
                    }
                }, function (err) {});
                Book.findOneAndUpdate({'name':bookName},{$inc:{'like':1}},function(err){});
            }
            else{
                Book.findOneAndUpdate({"name":bookName}, {
                    $addToSet: {
                        review: {
                            "content": req.body.review,
                            "reviewer":user.account
                        }
                    }
                }, function (err) {});
            }
        });
        User.findByIdAndUpdate(userId, {
            $addToSet: {
                recommendation: {
                    "bookname": bookName
                }
            }
        }, function (err) {
            if (err)
                res.send('Sorry! Try it again!');
            else
                res.send('You recommended [' + bookName + ']');
        })
    }
    else
        res.send('Book NOT Found!');
}
module.exports = router;
