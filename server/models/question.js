var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        questionText: {type: String},
        responseType: {type: String},
        multiText: [{type: String}],
        response: [{type:Schema.Types.ObjectId, ref: 'Response'}],
        questionOwner: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);