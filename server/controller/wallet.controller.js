const { PaginationParameters } = require('mongoose-paginate-v2');
const asyncHandler = require('express-async-handler');
const WalletModel = require('../model/wallet.model');

const createWallet = asyncHandler(async (req, res) => {
  const { name, description, userId, balance, currencyId } = req.body;
  const wallet = new WalletModel({
    name,
    description,
    userId,
    balance,
    currencyId,
  });
  await wallet.save();
  return res.json(wallet);
});

const getWalletsByUserId = asyncHandler(async (req, res) => {
  const id = req.params.userId;
  const options = new PaginationParameters(req).get();
  const wallets = await WalletModel.paginate({ userId: id }, options);
  return res.json(wallets);
});

module.exports = { createWallet, getWalletsByUserId };
