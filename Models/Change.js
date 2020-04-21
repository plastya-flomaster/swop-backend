const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeSchema = new Schema({

    senderId: String,
    recieverId: String,
    senderitemId: String,
    recieverItemId: String,
    status: String
});

module.exports = Change = mongoose.model('change', ChangeSchema);