var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        questionText: {type: String, required: true},
        responseType: {type: String, required: true},
        multiText: [{type: String}],
        response: [{type:Schema.Types.ObjectId, ref: 'Response'}],
        questionOwner: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

module.exports = mongoose.model('Question', QuestionSchema);