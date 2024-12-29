const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sign: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);
CategorySchema.plugin(mongoosePaginate);

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
