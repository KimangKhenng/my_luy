const express = require('express');

const {
  createCurrency,
  getCurrencies,
} = require('../../controller/currency.controller');

const CurrencyRouter = express.Router();

CurrencyRouter.post('/', createCurrency);
CurrencyRouter.get('/', getCurrencies);

module.exports = CurrencyRouter;
