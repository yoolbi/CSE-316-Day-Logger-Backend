var mongoose = require('mongoose');
const bcrypt = require('bcrypt')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: true,
            match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Please fill a valid password']
        },
        profile_url: {type: String},
        address: {
            street: {type: String},
            state: {type: String},
        }
    }
);

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/catalog/user/' + this._id;
    });

UserSchema.statics.findAndValidate = async function (email, password) {
    const user = await this.findOne({email});
    if(!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false;
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
module.exports = mongoose.model('User', UserSchema);