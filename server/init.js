require('dotenv').config();
const dbConnect = require('./db/db');
const CategoryModel = require('./model/category.model');
const CurrencyModel = require('./model/currency.model');

dbConnect().catch((err) => {
  console.log(err);
});

(async () => {
  const currencies = [
    { name: 'US Dollar', symbol: 'USD', sign: '$' },
    { name: 'Cambodian Riel', symbol: 'KHR', sign: '៛' },
    { name: 'Euro', symbol: 'EUR', sign: '€' },
    { name: 'British Pound', symbol: 'GBP', sign: '£' },
    { name: 'Japanese Yen', symbol: 'JPY', sign: '¥' },
    { name: 'Australian Dollar', symbol: 'AUD', sign: 'A$' },
    { name: 'Canadian Dollar', symbol: 'CAD', sign: 'C$' },
    { name: 'Swiss Franc', symbol: 'CHF', sign: 'CHF' },
    { name: 'Chinese Yuan', symbol: 'CNY', sign: '¥' },
    { name: 'Indian Rupee', symbol: 'INR', sign: '₹' },
    { name: 'South Korean Won', symbol: 'KRW', sign: '₩' },
  ];

  await CurrencyModel.insertMany(currencies);
})();
