const { PaginationParameters } = require('mongoose-paginate-v2');
const asyncHandler = require('express-async-handler');
const UserModel = require('../model/user.model');
const CategoryModel = require('../model/category.model');
const ExpenseModel = require('../model/expense.model');
const mongoose = require('mongoose');

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

    // Add a field for converted amount
    {
      $addFields: {
        convertedAmount: {
          $multiply: [
            '$amount',
            {
              $literal: {
                USD: 1,
                KHR: 0.00024,
                EUR: 1.08,
                GBP: 1.26,
                JPY: 0.007,
                AUD: 0.65,
                CAD: 0.74,
                CHF: 1.09,
                CNY: 0.14,
                INR: 0.012,
                KRW: 0.00077,
              }['$currency.symbol'],
            },
          ],
        },
      },
    },

    // Group by category to calculate total spending per category
    {
      $group: {
        _id: '$category.name', // Group by category name
        totalAmountUSD: { $sum: '$convertedAmount' }, // Sum of spending per category in USD
      },
    },

    // Calculate the total spending across all categories
    {
      $group: {
        _id: null,
        categories: {
          $push: { category: '$_id', totalAmountUSD: '$totalAmountUSD' },
        },
        totalSpentUSD: { $sum: '$totalAmountUSD' },
      },
    },

    // Calculate percentages for each category
    {
      $unwind: '$categories',
    },
    {
      $addFields: {
        'categories.percentage': {
          $multiply: [
            { $divide: ['$categories.totalAmountUSD', '$totalSpentUSD'] },
            100,
          ],
        },
      },
    },

    // Reformat output to include totalSpent and category breakdown
    {
      $group: {
        _id: null,
        totalSpentUSD: { $first: '$totalSpentUSD' },
        categoryBreakdown: { $push: '$categories' },
      },
    },

    // Project the final structure
    {
      $project: {
        _id: 0,
        totalSpentUSD: 1,
        categoryBreakdown: 1,
      },
    },
  ]);

  return res.json(summary[0] || { totalSpentUSD: 0, categoryBreakdown: [] });
});

module.exports = {
  createUser,
  getUsers,
  getUserbyTelegramId,
  monthlySpendingById,
};
