const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    // walletId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Wallet',
    //   required: true,
    // },
    amount: { type: Number, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true },
);

ExpenseSchema.plugin(mongoosePaginate);

const ExpenseModel = mongoose.model('Expense', ExpenseSchema);

module.exports = ExpenseModel;
