import { bold, fmt, italic, link } from '@grammyjs/parse-mode';
import axios from 'axios';
import moment from 'moment';
import keyboard from '../keyboard/menu.js';

const { BOT_SERVER } = process.env;

const summaryReply = async (ctx) => {
  // console.log('summaryReply');
  const user = await axios.get(
    `${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`,
  );
  const { data } = await axios.get(
    `${BOT_SERVER}/v1/users/monthly-summary/${user.data._id}`,
  );

  const { totalSpentUSD, categoryBreakdown } = data;

  const formattedCategories = categoryBreakdown
    .map(
      (item) =>
        `${bold(item.category)}: ${item.totalAmountUSD.toFixed(2)} USD (${bold(
          item.percentage,
        )}%)`,
    )
    .join('\n');

  return {
    message: fmt(
      ['Spending Summary:\n\n', '\n', '\n\n', '', ''],
      fmt`${bold(`@${user.data.username}`)}`,
      fmt`${italic(`${moment().format('MMMM YYYY')}`)}`,
      fmt`${bold('Total')}: ${totalSpentUSD.toFixed(2)} USD`,
      fmt`\n\n${formattedCategories}`,
      fmt`\n\n${italic(
        `My Luy - by TFD, built with privacy in mind. More information: ${link(
          'tfdevs.com/projects/myluy',
          'https://tfdevs.com/projects/myluy',
        )}`,
      )}`,
    ),
    option: {
      reply_markup: keyboard,
      disable_web_page_preview: true,
    },
  };
};

export default summaryReply;
