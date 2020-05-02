const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    category: String,
    description: String,
    tags: [{
        tag: String
    }],
    photos: [{
        url: String
    }]
});

const ItemsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    items: [ ItemSchema ]
});

module.exports = Items = mongoose.model('items', ItemsSchema);
