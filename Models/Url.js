const mongoose = require('mongoose');

var Url = mongoose.model('url',{
    originalUrl: String,
    urlCode: String,
    shortUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = {
    Url
}