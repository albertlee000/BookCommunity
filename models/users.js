let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
        account:{type:String,required:true,unique:true},
        psw:{type:String,required:true,unique:true},
        email:String,
        recommendation:[{
            bookname:{type:String,default:null},
            _id:false
        }]

    },
    { collection: 'usersdb' });
module.exports = mongoose.model('User', UserSchema);