import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

export default CurrencyModel;
