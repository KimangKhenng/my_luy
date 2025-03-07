import express from 'express';
import {
  getUsers,
  createUser,
  getUserbyTelegramId,
  monthlySpendingById,
} from '../../controller/user.controller.js';

const UserRouter = express.Router();

UserRouter.post('/', createUser);
UserRouter.get('/', getUsers);
UserRouter.get('/telegram/:telegramId', getUserbyTelegramId);
UserRouter.get('/monthly-summary/:userId', monthlySpendingById);

export default UserRouter;
