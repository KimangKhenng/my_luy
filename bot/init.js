const axios = require('axios');
const menu = require('./resources/menu');
const { name, description, short_description } = require('./resources/info');
require('dotenv').config();

const endpoints = [
  `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyCommands`,
  `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyName`,
  `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyDescription`,
  `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setMyShortDescription`,
];

(async () => {
  /**
   * Initialize Bot Commands
   */
  let result = await axios.post(endpoints[0], menu);
  console.log(result.data);
  /**
   * Initialize Bot Name
   */
  result = await axios.post(endpoints[1], name);
  console.log(result.data);
  /**
   * Initialize Bot Description
   */
  result = await axios.post(endpoints[2], description);
  console.log(result.data);
  /**
   * Initialize Bot Short Description
   */
  result = await axios.post(endpoints[3], short_description);
  console.log(result.data);
})();
