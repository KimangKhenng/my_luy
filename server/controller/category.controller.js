const { PaginationParameters } = require('mongoose-paginate-v2');
const asyncHandler = require('express-async-handler');
const CategoryModel = require('../model/category.model');

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, userId } = req.body;
  const category = new CategoryModel({
    name,
    description,
    userId,
  });
  await category.save();
  return res.json(category);
});

const getCategoriesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const options = new PaginationParameters(req).get();
  const categories = await CategoryModel.paginate({ userId }, options);
  return res.json(categories);
});

module.exports = { createCategory, getCategoriesByUserId };
