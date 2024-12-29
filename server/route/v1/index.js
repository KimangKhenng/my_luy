const express = require('express');

const CurrencyRouter = require('./currency.route');
const CategoryRouter = require('./category.route');
const ExpenseRouter = require('./expense.route');
const WalletRouter = require('./wallet.route');
const UserRouter = require('./user.route');

const v1Router = express.Router();

v1Router.use('/currencies', CurrencyRouter);
v1Router.use('/categories', CategoryRouter);
v1Router.use('/expenses', ExpenseRouter);
v1Router.use('/wallets', WalletRouter);
v1Router.use('/users', UserRouter);

module.exports = v1Router;
