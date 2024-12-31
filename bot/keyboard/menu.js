const { InlineKeyboard } = require('grammy');
const { Menu } = require('@grammyjs/menu');
const firstRow = [
  // ['Previous', 'next_month'],
  ['Add Expense 💰', 'add_expense'],
  // ['Next', 'previous_month'],
];
const secondRow = [
  ['Transcations', 'transcations'],
  ['Setting', 'setting'],
];
const buttonRow = firstRow.map(([label, data]) =>
  InlineKeyboard.text(label, data),
);

const settingRow = secondRow.map(([label, data]) =>
  InlineKeyboard.text(label, data),
);

const keyboard = InlineKeyboard.from([buttonRow, settingRow]);

module.exports = { keyboard };
