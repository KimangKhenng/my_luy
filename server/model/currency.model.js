const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CurrencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String },
  },
  { timestamps: true },
);

CurrencySchema.plugin(mongoosePaginate);

const CurrencyModel = mongoose.model('Currency', CurrencySchema);

module.exports = CurrencyModel;
