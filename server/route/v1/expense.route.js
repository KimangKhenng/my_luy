import express from 'express';
import {
  createExpense,
  getTranscationsByUserId,
} from '../../controller/expense.controller.js';

const ExpenseRouter = express.Router();

ExpenseRouter.post('/', createExpense);
ExpenseRouter.get('/', getTranscationsByUserId);

export default ExpenseRouter;
