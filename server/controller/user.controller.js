const { PaginationParameters } = require('mongoose-paginate-v2');
const asyncHandler = require('express-async-handler');
const UserModel = require('../model/user.model');
const CategoryModel = require('../model/category.model');

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
    { userId, name: 'Food', description: '' },
    { userId, name: 'Groceries', description: '' },
    { userId, name: 'Shopping', description: '' },
    { userId, name: 'Transport', description: '' },
    { userId, name: 'Utility', description: '' },
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

module.exports = { createUser, getUsers, getUserbyTelegramId };
