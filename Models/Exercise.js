var mongoose = require('mongoose');

var Exercise = mongoose.model('Exercise',{
  userID:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  description:{
    type:String,
    required:true
  },
  duration:{
    type:Number,
    required:true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = {Exercise}