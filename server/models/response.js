var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResponseSchema = new Schema(
    {
        responseText: {type: String, Number},
        date: {type: String},
    }
);

ResponseSchema
    .virtual('url')
    .get(function () {
        return '/catalog/response/' + this._id;
    });

module.exports = mongoose.model('Response', ResponseSchema);