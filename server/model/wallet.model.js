const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const WalletSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    balance: { type: Number, require: true },
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
  },
  { timestamps: true },
);

WalletSchema.plugin(mongoosePaginate);

const WalletModel = mongoose.model('Wallet', WalletSchema);

module.exports = WalletModel;
