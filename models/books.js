// const books = [{id:10001,name:'War_and_Peace',recommended:500},
//     {id:10002,name:'Adventure_of_Sherlock_Holmes',recommended:400},
//     {id:10003,name:'We',recommended:400},
//     {id:10004,name:'We_are_electric',recommended:400},
//     {id:10005,name:'123_gogogo',recommended:400},
//     {id:10006,name:"\"This is my life\"",recommended:400}];
let mongoose = require('mongoose');
let BookSchema = new mongoose.Schema({

        name: {type:String,required:true},
        author:{type:String,required:true},
        sumary:{type:String,default:null},
        like: {type: Number, default: 0},
        review:[{
            content:{type:String,default: null},
            reviewer:{type:String,default:null},
            _id:false
        }]

    },
    { collection: 'books' });
module.exports = mongoose.model('Book', BookSchema);