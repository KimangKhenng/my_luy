/* eslint-disable no-console */
require('dotenv').config();

const { Bot, GrammyError, HttpError, session } = require('grammy');
const {
  conversations,
  createConversation,
} = require('@grammyjs/conversations');
const { hydrateReply, parseMode } = require('@grammyjs/parse-mode');
const { I18n } = require('@grammyjs/i18n');
const { run } = require('@grammyjs/runner');
const axios = require('axios');
const { summaryReply } = require('./conversation/summary');
const { expense } = require('./conversation/expense');
const transcation = require('./conversation/transcation');

const { BOT_TOKEN } = process.env;
const { BOT_SERVER } = process.env;

// const i18n = new I18n({
//   defaultLocale: 'en',
//   useSession: true,
//   directory: './bot/locales',
//   fluentBundleOptions: { useIsolating: false },
// });
const bot = new Bot(BOT_TOKEN);
bot.use(hydrateReply);
// bot.api.config.use(parseMode('MarkdownV2'));
bot.use(session({ initial: () => ({}) }));
// bot.use(i18n);
bot.use(conversations());
bot.use(createConversation(expense, 'expense'));
bot.use(createConversation(transcation, 'transcation'));
// bot.use(menu);

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
    if (!data) {
      /**
       * Register New User
       */
      await axios.post(`${BOT_SERVER}/v1/users`, {
        telegramId: ctx.from.id,
        username: ctx.from.username,
      });
    }

    const { message, option } = await summaryReply(ctx);
    // console.log(message);
    ctx.replyFmt(message, option);
  }
});

// Expense Functionality
bot.callbackQuery('add_expense', async (ctx) => {
  await ctx.conversation.enter('expense');
});
// Setting
bot.callbackQuery('setting', async (ctx) => {
  await ctx.replyWithMarkdownV2('*This* is _withMarkdownV2_ `formatting`');
});

bot.callbackQuery('transcations', async (ctx) => {
  await ctx.conversation.enter('transcation');
});

bot.callbackQuery('home', async (ctx) => {
  const { message, option } = await summaryReply(ctx);
  ctx.replyFmt(message, option);
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
