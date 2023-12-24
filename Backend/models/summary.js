const mongoose = require('mongoose');
const summary_Schema= new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    videoid:{
      type:String,
    },
    message:{
      type:String, 
    }, 
    tag:{
      type:String,
      required:true
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    filepath:{
      type:String,
    },
   selectedData: [
    [
      {
        type: String,
        required: true
      },
      {
        type: String,
        required: true
      }
    ]
  ]

});

const summary= mongoose.model('summary', summary_Schema);
module.exports = summary;
