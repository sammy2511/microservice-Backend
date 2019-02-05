var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Exercise');

mongoose.connection.once('open',() => {
    console.log('Connection successful...');
  

}).on('error',(e) => {
    console.log('Error occured :',e)
})

module.exports = { mongoose }