const { bold, fmt, italic } = require('@grammyjs/parse-mode');
const axios = require('axios');
const moment = require('moment');
const keyboard = require('../keyboard/menu');
const { BOT_SERVER } = process.env;

const summaryReply = async (username, userId) => {
  const { data } = await axios.get(
    `${BOT_SERVER}/v1/users/monthly-summary/${userId}`,
  );

  const { totalSpentUSD, categoryBreakdown } = data;

  const formattedCategories = categoryBreakdown
    .map(
      (item) =>
        `${bold(item.category)}: ${item.totalAmountUSD.toFixed(2)} USD (${
          item.percentage
        }%)`,
    )
    .join('\n');

  //   console.log(formattedCategories);
  //   console.log('Here');

  return {
    message: fmt(
      ['Spending Summary:\n\n', '\n', '\n\n', ''],
      fmt`${bold(`${username}`)}`,
      fmt`${italic(`${moment().format('ll')}`)}`,
      fmt`${bold('Total: ')}: ${totalSpentUSD.toFixed(2)} USD`,
      fmt`\n${formattedCategories}`,
    ),
    option: { reply_markup: keyboard },
  };
};

module.exports = { summaryReply };
