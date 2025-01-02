const { bold, fmt, italic } = require('@grammyjs/parse-mode');
const axios = require('axios');
const { InlineKeyboard } = require('grammy');
const { summaryReply } = require('./summary');

const { BOT_SERVER } = process.env;

async function parseAmount(input) {
  try {
    // Fetch currency data from the API
    const { data } = await axios.get(`${BOT_SERVER}/v1/currencies`);
    const currencyData = data.docs;

    // Split the input into amount and currency symbol
    const [amountStr, currencyStr] = input.split(' ');

    // Check if the input is valid (amount is a number and currency is present)
    if (!amountStr || !currencyStr || isNaN(amountStr)) {
      return { err: true };
    }

    const amount = parseFloat(amountStr);
    const currencySymbol = currencyStr.toUpperCase();

    // Find the currency in the data
    const currency = currencyData.find((c) => c.symbol === currencySymbol);

    // If currency is not found, return invalid error
    if (!currency) {
      return { err: true };
    }

    // Return the parsed amount and currency data
    return {
      amount,
      currency: currency.symbol,
      id: currency._id,
      err: false,
    };
  } catch (error) {
    // Handle any errors (e.g., network issues)
    return { err: true };
  }
}

async function expense(conversation, ctx) {
  const responseTele = await conversation.external(() =>
    axios.get(`${BOT_SERVER}/v1/users/telegram/${ctx.from.id}`),
  );
  const userId = responseTele.data._id;
  const response = await conversation.external(() =>
    axios.get(`${BOT_SERVER}/v1/categories/${userId}`),
  );
  const categories = response.data.docs;

  const categoriesMenu = [];
  categories.forEach((item) => {
    categoriesMenu.push([
      `${item.sign} ${item.name}`,
      `${item.name.toLowerCase()}:${item._id}`,
    ]);
  });

  //   console.log(categoriesMenu);

  const buttonRow = categoriesMenu.map(([label, data]) =>
    InlineKeyboard.text(label, data),
  );
  // buttonRow.push(InlineKeyboard.text('🆕 New Category', 'new_category'));
  const keyboard = InlineKeyboard.from([buttonRow]).toTransposed();

  await ctx.answerCallbackQuery({
    text: 'Please select category of your spending!',
  });
  await ctx.replyFmt('Please select category of your spending!', {
    reply_markup: keyboard,
  });
  const newContext = await conversation.wait();
  // console.log(newContext.update.callback_query.data);
  const categoryId = newContext.update.callback_query.data.split(':')[1];

  await ctx.replyFmt(
    fmt(
      ['', '\n\n', '\n'],
      fmt`Please input the amount you spend on your ${bold(
        newContext.update.callback_query.data.split(':')[0],
      )}!`,
      fmt`For example ${bold('10 USD')}`,
      fmt`or ${bold('4000 KHR')}`,
    ),
  );
  let {
    msg: { text },
  } = await conversation.waitFor('message:text');

  let spending = await conversation.external(() => parseAmount(text));
  console.log(spending);
  while (spending.err) {
    await ctx.replyFmt(
      fmt`${bold(
        'Invalid Input!',
      )}\n\n Make sure to input in these format:\n - 10 USD\n - 10 usd\n - 40000 KHR\n - 40000 khr`,
    );
    let {
      msg: { text },
    } = await conversation.waitFor('message:text');
    spending = await conversation.external(() => parseAmount(text));
  }

  await ctx.replyFmt(
    fmt(
      ['', '\n\n', '\n', '\n'],
      fmt`Please describe your ${bold(
        newContext.update.callback_query.data.split(':')[0],
      )}!`,
      fmt`For example:Mii \n${bold('Breakfast')}`,
      fmt`or ${bold('KuyTeav')}`,
      fmt`or ${bold('7Eleven')}`,
    ),
  );
  const reply = await conversation.waitFor('message:text');

  await conversation.external(() =>
    axios.post(`${BOT_SERVER}/v1/expenses`, {
      userId,
      categoryId,
      currencyId: spending.id,
      amount: spending.amount,
      description: reply.message.text,
    }),
  );
  await ctx.replyFmt(
    fmt`You spend ${bold(spending.amount)}${spending.currency} on ${bold(
      newContext.update.callback_query.data.split(':')[0],
    )} - ${reply.message.text}`,
  );
  const { message, option } = await conversation.external(() =>
    summaryReply(ctx),
  );
  // console.log(message);
  return ctx.replyFmt(message, option);
}

module.exports = { expense };
