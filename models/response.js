var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResponseSchema = new Schema(
    {
        responseText: {type: String, Number},
        date: {type: String},
    }
);

module.exports = mongoose.model('Response', ResponseSchema);