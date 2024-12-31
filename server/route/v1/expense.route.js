const express = require('express');

const {
  createExpense,
  getTranscationsByUserId,
} = require('../../controller/expense.controller');

const ExpenseRouter = express.Router();

ExpenseRouter.post('/', createExpense);
ExpenseRouter.get('/', getTranscationsByUserId);

module.exports = ExpenseRouter;
