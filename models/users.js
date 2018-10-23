let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({

        account:{type:String,required:true,unique:true},
        psw:{type:String,required:true},
        email:String,
        recommendation:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Book'

        }],
        like:[{
            type:String,
            default:null,
            _id:false
        }],

    },
    { collection: 'users' });
module.exports = mongoose.model('User', UserSchema);