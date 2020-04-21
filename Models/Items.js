const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    items: [
        {
        name: String,
            category: {
                categoryId: Number,
                category: String
            },
            description: String,
            types: [{
                typeId: Number,
                typeName: String
            }],
            photos: [{
                url: String
            }]
        }]
});

module.exports = Items = mongoose.model('items', ItemsSchema);