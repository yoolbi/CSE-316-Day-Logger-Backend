var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        questionText: {type: String, required: true},
        responseType: {type: String, required: true},
        multipleChoiceQ1: {type: String},
        multipleChoiceQ2: {type: String},
        multipleChoiceQ3: {type: String},
        date: {type: String, required: true},
        questionOwner: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

QuestionSchema
    .virtual('url')
    .get(function () {
        return '/catalog/question/' + this._id;
    });

module.exports = mongoose.model('Question', QuestionSchema);