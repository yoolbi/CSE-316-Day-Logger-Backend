var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResponseSchema = new Schema(
    {
        responseText: {type: String, Number},
        date: {type: String},
        parentQuestion: {type: Schema.Types.ObjectId, ref: 'Question'}
    }
);

module.exports = mongoose.model('Response', ResponseSchema);