import express from 'express';
import {
  createWallet,
  getWalletsByUserId,
} from '../../controller/wallet.controller.js';

const WalletRouter = express.Router();

WalletRouter.post('/', createWallet);
WalletRouter.get('/:userId', getWalletsByUserId);

export default WalletRouter;
