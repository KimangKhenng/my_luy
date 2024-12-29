const { PaginationParameters } = require('mongoose-paginate-v2');
const asyncHandler = require('express-async-handler');
const ExpenseModel = require('../model/expense.model');

const createExpense = asyncHandler(async (req, res) => {
  const { userId, categoryId, currencyId, amount, description } = req.body;

  const transcation = new ExpenseModel({
    userId,
    categoryId,
    currencyId,
    amount,
    description,
  });

  await transcation.save();
  return res.json(transcation);
});

const getTranscationsByUserId = asyncHandler(async (req, res) => {
  const id = req.params.userId;
  const options = new PaginationParameters(req).get();
  const expenses = await ExpenseModel.paginate({ userId: id }, options);
  return res.json(expenses);
});

module.exports = { createExpense, getTranscationsByUserId };
