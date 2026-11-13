import 'dotenv/config';
import serverless from 'serverless-http';
import { app } from '../../src/app.js';

const expressHandler = serverless(app);

// Netlify invokes this per request. The database module keeps the connection
// alive while this function instance remains warm.
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return expressHandler(event, context);
};
