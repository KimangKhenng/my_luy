/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import v1Router from './route/v1/index.js';
import dbConnect from './db/db.js';
import setupSwagger from './swagger/index.js';

dotenv.config();

const PORT = process.env.APP_PORT;

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
