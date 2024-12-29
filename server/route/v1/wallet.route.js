const express = require('express');

const {
  createWallet,
  getWalletsByUserId,
} = require('../../controller/wallet.controller');

const WalletRouter = express.Router();

WalletRouter.post('/', createWallet);
WalletRouter.get('/:userId', getWalletsByUserId);

module.exports = WalletRouter;
