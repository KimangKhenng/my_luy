import express from 'express';
import {
  createCurrency,
  getCurrencies,
} from '../../controller/currency.controller.js';

const CurrencyRouter = express.Router();

CurrencyRouter.post('/', createCurrency);
CurrencyRouter.get('/', getCurrencies);

export default CurrencyRouter;
