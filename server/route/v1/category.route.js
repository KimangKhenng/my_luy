const express = require('express');

const {
  createCategory,
  getCategoriesByUserId,
} = require('../../controller/category.controller');

const CategoryRouter = express.Router();

CategoryRouter.post('/', createCategory);
CategoryRouter.get('/:userId', getCategoriesByUserId);

module.exports = CategoryRouter;
