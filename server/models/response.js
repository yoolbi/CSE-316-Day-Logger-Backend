var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResponseSchema = new Schema(
    {
        responseText: {type: String, Number},
        responseQuestion: {type: Schema.Types.ObjectId, ref: 'Question', required: true}
    }
);

ResponseSchema
    .virtual('url')
    .get(function () {
        return '/catalog/response/' + this._id;
    });

module.exports = mongoose.model('Response', ResponseSchema);