const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    category: String
});

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

module.exports = Category = mongoose.model('category', CategorySchema);

module.exports = Items = mongoose.model('items', ItemsSchema);
