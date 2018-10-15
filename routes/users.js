let User = require('../models/users');
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
//do recommende
// router.Recommende = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     User.findById(req.params.id , function(err,book) {
//         if (err)
//             res.send({message:'Book NOT Found!'});
//         else {
//             book.recommended += 1;
//             book.save(function (err) {
//                 if (err)
//                     res.send('Recommended NOT Successful!');
//                 else
//                     res.send('Recommended successfully!');
//             });
//         }
//     });
// }
module.exports = router;
