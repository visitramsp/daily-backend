import 'dotenv/config';
import serverless from 'serverless-http';
import { app } from '../../src/app.js';
import { connectDatabase } from '../../src/config/database.js';

const expressHandler = serverless(app);

// Netlify invokes this per request. The database module keeps the connection
// alive while this function instance remains warm.
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDatabase(process.env.MONGODB_URI);
    return await expressHandler(event, context);
  } catch (error) {
    console.error('Function startup failed:', error);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Service unavailable' }),
    };
  }
};
