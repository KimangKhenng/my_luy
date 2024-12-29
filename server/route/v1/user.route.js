const express = require('express');
const {
  getUsers,
  createUser,
  getUserbyTelegramId,
} = require('../../controller/user.controller');

const UserRouter = express.Router();

UserRouter.post('/', createUser);
UserRouter.get('/', getUsers);
UserRouter.get('/telegram/:telegramId', getUserbyTelegramId);

module.exports = UserRouter;
