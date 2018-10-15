let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
        account:String,
        psw:String,
        email:String,
        recommendation:[{
            bookname:String,
            review:String
        }]

    },
    { collection: 'usersdb' });
module.exports = mongoose.model('User', UserSchema);