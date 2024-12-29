const { InlineKeyboard } = require('grammy');
const labelDataPairs = [
  // ["Previous", "next_month"],
  ['Expense 💰', 'add_expense'],
  // ["Next", "previous_month"],
];
const buttonRow = labelDataPairs.map(([label, data]) =>
  InlineKeyboard.text(label, data),
);

const keyboard = InlineKeyboard.from([buttonRow]);

module.exports = keyboard;
