import { PaginationParameters } from 'mongoose-paginate-v2';
import asyncHandler from 'express-async-handler';
import CategoryModel from '../model/category.model.js';

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

export { createCategory, getCategoriesByUserId };
