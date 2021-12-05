var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AddressSchema = new Schema(
    {
        street: {type: String},
        state: {type: String}
    }
);

module.exports = mongoose.model('Address', AddressSchema);