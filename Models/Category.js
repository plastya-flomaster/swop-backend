const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  category: String,
});
module.exports = Categories = mongoose.model('categories', CategoriesSchema);
