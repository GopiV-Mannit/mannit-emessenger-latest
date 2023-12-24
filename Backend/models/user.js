const mongoose = require('mongoose');
const user= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true 
    },
    adminid:{
        type:String,
        required:true
    }, 
    state:{
        type:String,   
    },
    district:{
        type:String,
    },
    area:{
        type:String,
    },
    group:{
        type:String,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
      }
});
const members= mongoose.model('User', user);
module.exports = members;

