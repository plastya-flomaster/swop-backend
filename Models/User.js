const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactsSchema = new Schema({
    phone: String,
    instagram: String

});
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    contacts: ContactsSchema,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Contacts = ContactsSchema; 
module.exports = User = mongoose.model('users', UserSchema);

