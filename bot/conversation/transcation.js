import { bold, fmt, italic, link } from '@grammyjs/parse-mode';
import axios from 'axios';
import { InlineKeyboard } from 'grammy';
import moment from 'moment';
import qs from 'qs';
import { markdownTable } from 'markdown-table';

const { BOT_SERVER } = process.env;

const transcation = async (conversation, ctx) => {
  const { data } = await conversation.external(() =>
    axios.get(`${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const transcations = await conversation.external(() =>
    axios.get(`${BOT_SERVER}/v1/expenses`, {
      params: {
        page: 1,
        limit: 100,
        query: JSON.stringify({
          userId: data._id,
          createdAt: {
            $gte: today.toISOString(),
            $lt: tomorrow.toISOString(),
          },
        }),
        sort: {
          createdAt: 'desc',
        },
        populate: 'categoryId currencyId',
      },
      paramsSerializer: (params) => qs.stringify(params, { encode: true }),
    }),
  );

  const formattedTrans = transcations.data.docs
    .map(
      (item, index) =>
        `${index + 1} - ${bold(item.amount)} ${item.currencyId.sign} ${
          item.description ? `- ${italic(item.description)}` : ''
        } | ${item.categoryId.sign} ${item.categoryId.name}`,
    )
    .join('\n');

  const keyboard = new InlineKeyboard()
    .text('Home', 'home')
    .row()
    .text('Previous', 'previous')
    .text('Add Expense 💰', 'add_expense')
    .text('Next', 'next')
    .row()
    .text('Delete', 'delete_expense')
    .text('Edit', 'edit_expense');

  await ctx.replyFmt(
    fmt(
      ['', '', '', '', ''],
      fmt`${bold('Transcations:')}`,
      fmt`\n\n${italic(`${moment().format('DD MMMM YYYY')}`)}`,
      fmt`\n\n${formattedTrans}`,
      fmt`\n\n${italic(
        `My Luy - by TFD, built with privacy in mind. More information: ${link(
          'tfdevs.com/projects/myluy',
          'https://tfdevs.com/projects/myluy',
        )}`,
      )}`,
    ),
    {
      reply_markup: keyboard,
    },
  );
};

export default transcation;
