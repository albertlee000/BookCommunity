let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({

        account:{type:String,required:true,unique:true},
        psw:{type:String,required:true},
        email:String,
        recommendation:[{
            bookname:{type:String,default:null,ref:'books'},
            _id:false
        }],
        like:[{
            bookname:{type:String,default:null},
            _id:false
        }],

    },
    { collection: 'users' });
module.exports = mongoose.model('User', UserSchema);