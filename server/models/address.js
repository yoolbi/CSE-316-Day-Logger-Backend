var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AddressSchema = new Schema(
    {
        street: {type: String},
        state: {type: String}
    }
);

AddressSchema
    .virtual('url')
    .get(function () {
        return '/catalog/address/' + this._id;
    });

module.exports = mongoose.model('Address', AddressSchema);