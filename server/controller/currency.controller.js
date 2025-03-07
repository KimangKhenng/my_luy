import asyncHandler from 'express-async-handler';
import { PaginationParameters } from 'mongoose-paginate-v2';
import CurrencyModel from '../model/currency.model.js';

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

export { createCurrency, getCurrencies };
