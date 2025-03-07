import { PaginationParameters } from 'mongoose-paginate-v2';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import UserModel from '../model/user.model.js';
import CategoryModel from '../model/category.model.js';
import ExpenseModel from '../model/expense.model.js';

const createUser = asyncHandler(async (req, res) => {
  const { telegramId, username } = req.body;
  const user = new UserModel({
    telegramId,
    username,
  });
  await user.save();
  const userId = user._id;
  // Initialize default categories
  const categories = [
    { userId, name: 'Food', description: '', sign: '🍛' },
    { userId, name: 'Groceries', description: '', sign: '🏪' },
    { userId, name: 'Shopping', description: '', sign: '🛒' },
    { userId, name: 'Transport', description: '', sign: '🚌' },
    { userId, name: 'Utility', description: '', sign: '⚡️' },
  ];

  await CategoryModel.insertMany(categories);

  return res.json(user);
});

const getUsers = asyncHandler(async (req, res) => {
  const options = new PaginationParameters(req).get();
  const users = await UserModel.paginate(...options);
  return res.json(users);
});

const getUserbyTelegramId = asyncHandler(async (req, res) => {
  const id = req.params.telegramId;
  const user = await UserModel.findOne({ telegramId: id });
  return res.json(user);
});

const monthlySpendingById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const summary = await ExpenseModel.aggregate([
    // Match expenses for the given user and within the current month
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startOfMonth },
      },
    },

    // Lookup category details
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' }, // Flatten category array

    // Lookup currency details
    {
      $lookup: {
        from: 'currencies',
        localField: 'currencyId',
        foreignField: '_id',
        as: 'currency',
      },
    },
    { $unwind: '$currency' }, // Flatten currency array

    // // Add a field for converted amount
    {
      $addFields: {
        convertedAmount: {
          $multiply: [
            '$amount',
            {
              $switch: {
                branches: [
                  { case: { $eq: ['$currency.symbol', 'USD'] }, then: 1 },
                  { case: { $eq: ['$currency.symbol', 'KHR'] }, then: 0.00024 },
                  { case: { $eq: ['$currency.symbol', 'EUR'] }, then: 1.08 },
                  { case: { $eq: ['$currency.symbol', 'GBP'] }, then: 1.26 },
                  { case: { $eq: ['$currency.symbol', 'JPY'] }, then: 0.007 },
                  { case: { $eq: ['$currency.symbol', 'AUD'] }, then: 0.65 },
                  { case: { $eq: ['$currency.symbol', 'CAD'] }, then: 0.74 },
                  { case: { $eq: ['$currency.symbol', 'CHF'] }, then: 1.09 },
                  { case: { $eq: ['$currency.symbol', 'CNY'] }, then: 0.14 },
                  { case: { $eq: ['$currency.symbol', 'INR'] }, then: 0.012 },
                  { case: { $eq: ['$currency.symbol', 'KRW'] }, then: 0.00077 },
                ],
                default: 0, // Default to 0 if no match is found
              },
            },
          ],
        },
      },
    },

    // Group by category to calculate total spending per category
    {
      $group: {
        _id: {
          $concat: ['$category.sign', ' ', '$category.name'], // Combine sign and name
        },
        totalAmountUSD: { $sum: '$convertedAmount' }, // Sum of spending per category in USD
      },
    },

    // // Calculate the total spending across all categories
    {
      $group: {
        _id: null,
        categories: {
          $push: { category: '$_id', totalAmountUSD: '$totalAmountUSD' },
        },
        totalSpentUSD: { $sum: '$totalAmountUSD' },
      },
    },

    // // Calculate percentages for each category
    {
      $unwind: '$categories',
    },
    {
      $addFields: {
        'categories.percentage': {
          $round: [
            {
              $cond: {
                if: { $eq: ['$totalSpentUSD', 0] },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $divide: ['$categories.totalAmountUSD', '$totalSpentUSD'],
                    },
                    100,
                  ],
                },
              },
            },
            2,
          ],
        },
      },
    },

    // // Reformat output to include totalSpent and category breakdown
    {
      $group: {
        _id: null,
        totalSpentUSD: { $first: '$totalSpentUSD' },
        categoryBreakdown: { $push: '$categories' },
      },
    },

    // // Project the final structure
    {
      $project: {
        _id: 0,
        totalSpentUSD: 1,
        categoryBreakdown: 1,
      },
    },
  ]);

  // return res.json(summary);

  return res.json(summary[0] || { totalSpentUSD: 0, categoryBreakdown: [] });
});

export { createUser, getUsers, getUserbyTelegramId, monthlySpendingById };
