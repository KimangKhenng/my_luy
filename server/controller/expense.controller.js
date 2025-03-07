import { PaginationParameters } from 'mongoose-paginate-v2';
import asyncHandler from 'express-async-handler';
import ExpenseModel from '../model/expense.model.js';

// function mergeArrayToObject(array) {
//   return array.reduce((result, current) => {
//     return { ...result, ...current };
//   }, {});
// }

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
  // const id = req.params.userId;
  const options = new PaginationParameters(req).get();
  // console.log(...options);
  // options[0] = ;
  // console.log(options);
  // console.log({ userId: id }, ...options);
  const expenses = await ExpenseModel.paginate(...options);
  return res.json(expenses);
});

export { createExpense, getTranscationsByUserId };
