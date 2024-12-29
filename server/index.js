/* eslint-disable no-console */
const express = require('express');
require('dotenv').config();

const PORT = process.env.APP_PORT;

const bodyParser = require('body-parser');

const v1Router = require('./route/v1');
const dbConnect = require('./db/db');
const setupSwagger = require('./swagger');

dbConnect().catch((err) => {
  console.log(err);
});

const app = express();

/**
 * Trust Proxy
 */
app.set('trust proxy', true);

app.use(bodyParser.json());

app.use('/v1', v1Router);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
