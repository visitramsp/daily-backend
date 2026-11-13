import mongoose from 'mongoose';

// A Netlify Function may handle many requests in the same warm instance.
// Reuse the existing connection instead of opening one per request.
let connectionPromise;

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGODB_URI is required. Set it in your environment variables.');

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then(connection => {
        console.log('MongoDB connected');
        return connection;
      })
      .catch(error => {
        // Allow a later serverless invocation to retry after a failed cold start.
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}
