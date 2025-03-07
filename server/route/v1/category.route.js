import express from 'express';
import {
  createCategory,
  getCategoriesByUserId,
} from '../../controller/category.controller.js';

const CategoryRouter = express.Router();

CategoryRouter.post('/', createCategory);
CategoryRouter.get('/:userId', getCategoriesByUserId);

export default CategoryRouter;
