const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CurrencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    symbol: { type: String, required: true },
    sign: { type: String, required: true }
  },
  { timestamps: true },
);

CurrencySchema.plugin(mongoosePaginate);

const CurrencyModel = mongoose.model('Currency', CurrencySchema);

module.exports = CurrencyModel;
