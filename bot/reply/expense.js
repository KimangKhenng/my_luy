const { bold, fmt, italic } = require('@grammyjs/parse-mode');
const axios = require('axios');
const { InlineKeyboard } = require('grammy');
const { Router } = require('@grammyjs/router');

const { BOT_SERVER } = process.env;

const addExpense = async (ctx) => {
  const { data } = await axios.get(
    `${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`,
  );
  const response = await axios.get(`${BOT_SERVER}/v1/categories/${data._id}`);
  const categories = response.data.docs;

  const categoriesMenu = [];
  categories.forEach((item) => {
    categoriesMenu.push([
      `${item.sign} ${item.name}`,
      `expense_category:${item._id}`,
    ]);
  });

  //   console.log(categoriesMenu);

  const buttonRow = categoriesMenu.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );
  const keyboard = InlineKeyboard.from([buttonRow]).toTransposed();

  await ctx.answerCallbackQuery({
    text: 'Please select category of your spending!',
  });
  await ctx.replyFmt('Please select category of your spending!', {
    reply_markup: keyboard,
  });
};

const makeTranscation = async (ctx) => {
  await ctx.answerCallbackQuery('Please input the amount of your spending!');
  if (ctx.callbackQuery.data.split(':')[0] === 'expense_category') {
    /**
     * Asking for price
     */
    await ctx.replyFmt(
      fmt(
        ['', '\n\n', '\n'],
        fmt`Please input the amount of your spending!`,
        fmt`For example ${bold('10 USD or $10')}`,
        fmt`or ${bold('4000 KHR or 4000៛')}`,
      ),
    );
  }
};

module.exports = { addExpense, makeTranscation };
