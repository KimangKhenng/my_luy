/* eslint-disable no-console */
require('dotenv').config();

const { Bot, GrammyError, HttpError } = require('grammy');
const { I18n } = require('@grammyjs/i18n');
const { run } = require('@grammyjs/runner');
const axios = require('axios');
const { description } = require('./resources/info');

const { BOT_TOKEN } = process.env;
const { BOT_SERVER } = process.env;

// const i18n = new I18n({
//   defaultLocale: 'en',
//   directory: './bot/locales',
// });
const bot = new Bot(BOT_TOKEN);

// bot.use(i18n);

// Handle the /start command.
bot.command('start', async (ctx) => {
  /**
   * Initialize User in System
   */
  if (!ctx.from.isBot) {
    const { data } = await axios.get(
      `${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`,
    );
    console.log(data);
    if (!data) {
      /**
       * Register New User
       */
      const response = await axios.post(`${BOT_SERVER}/v1/users`, {
        telegramId: ctx.from.id,
        username: ctx.from.username,
      });
      const newUser = response.data;
      /**
       * Initialize Default Categories
       */
      ctx.reply(newUser);
    } else {
      ctx.reply(data);
    }
  }
});

// Reply to any message with "Hi there!".
bot.on('message', async (ctx) => {
  ctx.reply('Hi there 2!');
  const response = await axios.get(`${BOT_SERVER}/v1/currencies`);
  console.log(response.data);
});

bot.catch((err) => {
  const { ctx } = err;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

// Stopping the bot when the Node.js process
// is about to be terminated
const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();
process.once('SIGINT', stopRunner);
process.once('SIGTERM', stopRunner);

// (async () => {
//   await bot.start();
// })();
