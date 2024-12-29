const express = require('express');

const {
  createExpense,
  getTranscationsByUserId,
} = require('../../controller/expense.controller');

const ExpenseRouter = express.Router();

ExpenseRouter.post('/', createExpense);
ExpenseRouter.get('/:userId', getTranscationsByUserId);

module.exports = ExpenseRouter;
