const asyncHandler = require('express-async-handler');
const CurrencyModel = require('../model/currency.model');
const { PaginationParameters } = require('mongoose-paginate-v2');

const createCurrency = asyncHandler(async (req, res) => {
  const { name, symbol } = req.body;
  const currency = new CurrencyModel({
    name,
    symbol,
  });
  await currency.save();
  return res.json(currency);
});

const getCurrencies = asyncHandler(async (req, res) => {
  const options = new PaginationParameters(req).get();
  const currencies = await CurrencyModel.paginate(...options);
  return res.json(currencies);
});

module.exports = { createCurrency, getCurrencies };
