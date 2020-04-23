const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    category: String
});

const ItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    category: { type: Schema.Types.ObjectId, ref: 'category' },
    description: String,
    types: [{
        typeId: Number,
        typeName: String
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
