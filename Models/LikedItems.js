const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikedItemSchema = new Schema({
  items: { type: [String], required: true },
  userId: { type: String, required: require },
});

const LikedItemsCollectionSchema = new Schema({
  userId: { type: String, required: true },
  pairs: [LikedItemSchema],
  disLike: [String],
});

const LikedItems = mongoose.model('LikedItems', LikedItemsCollectionSchema);

module.exports = LikedItems;
