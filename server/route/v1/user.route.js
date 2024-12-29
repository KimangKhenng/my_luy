const express = require('express');
const {
  getUsers,
  createUser,
  getUserbyTelegramId,
  monthlySpendingById,
} = require('../../controller/user.controller');

const UserRouter = express.Router();

UserRouter.post('/', createUser);
UserRouter.get('/', getUsers);
UserRouter.get('/telegram/:telegramId', getUserbyTelegramId);
UserRouter.get('/monthly-summary/:userId', monthlySpendingById);

module.exports = UserRouter;
