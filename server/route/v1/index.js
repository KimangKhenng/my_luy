import express from 'express';

import CurrencyRouter from './currency.route.js';
import CategoryRouter from './category.route.js';
import ExpenseRouter from './expense.route.js';
import WalletRouter from './wallet.route.js';
import UserRouter from './user.route.js';

const v1Router = express.Router();

v1Router.use('/currencies', CurrencyRouter);
v1Router.use('/categories', CategoryRouter);
v1Router.use('/expenses', ExpenseRouter);
v1Router.use('/wallets', WalletRouter);
v1Router.use('/users', UserRouter);

export default v1Router;
