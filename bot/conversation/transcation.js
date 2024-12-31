const { bold, fmt, italic, link } = require('@grammyjs/parse-mode');
const axios = require('axios');
const { InlineKeyboard } = require('grammy');
const moment = require('moment');
const qs = require('qs');
const { BOT_SERVER } = process.env;

async function transcation(conversation, ctx) {
  const { data } = await conversation.external(() =>
    axios.get(`${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`),
  );
  console.log(data);
  console.log(ctx.from);

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

  //   console.log(transcations.data.docs);

  const formattedTrans = transcations.data.docs
    .map(
      (item) =>
        `${transcations.data.docs.indexOf(item) + 1}   -   ${bold(
          item.amount,
        )} ${item.currencyId.sign} ${
          item.description ? `- ${italic(item.description)}` : ''
        }   |   ${item.categoryId.sign} ${item.categoryId.name}`,
    )
    .join('\n');

  //   console.log(formattedTrans);

  const firstRow = [
    // ['Previous', 'next_month'],
    ['Home', 'home'],
    // ['Next', 'previous_month'],
  ];

  const secondRow = [
    // ['Previous', 'next_month'],
    ['Previous', 'previous'],
    ['Add Expense 💰', 'add_expense'],
    ['Next', 'next'],
    // ['Next', 'previous_month'],
  ];

  const thirdRow = [
    // ['Previous', 'next_month'],
    ['Delete', 'delete_expense'],
    ['Edit', 'edit_expense'],
    // ['Next', 'previous_month'],
  ];
  const firstButtons = firstRow.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );

  const secondButtons = secondRow.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );

  const thridButtons = thirdRow.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );

  const keyboard = InlineKeyboard.from([
    firstButtons,
    secondButtons,
    thridButtons,
  ]);
  await ctx.replyFmt(
    fmt(
      ['', '', '', '', ''],
      fmt`${bold('Transcations:')}`,
      fmt`\n\n${italic(`${moment().format('DD MMMM YYYY')}`)}`,
      fmt`\n\n${formattedTrans}`,
      //   fmt`\n\npage ${bold(transcations.data.page)} of ${bold(
      //     transcations.data.totalPages,
      //   )}`,
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
}
module.exports = transcation;
