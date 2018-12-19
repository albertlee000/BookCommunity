let mongoose = require('mongoose');
let BookSchema = new mongoose.Schema({

        name: {type:String,required:true},
        author:{type:String,required:true},
        summary:{type:String,default:null},
        like: {type: Number, default: 0},
        review:[{
            content:{type:String,default: null},
            reviewer:{type:String,default:null},
            _id:false
        }]

    },
    { collection: 'books' });
module.exports = mongoose.model('Book', BookSchema);
