import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { handler } from '../netlify/functions/api.js';

function request(path, method = 'GET', headers = {}) {
  return handler({
    path, httpMethod: method, headers, body: null,
    queryStringParameters: null, isBase64Encoded: false,
    requestContext: { identity: { sourceIp: '127.0.0.1' } },
  }, {});
}

test('health, preflight, and database failures have working CORS', async (t) => {
  let connectionAttempts = 0;
  t.mock.method(mongoose, 'connect', async () => {
    connectionAttempts++;
    throw Object.assign(new Error('Connection failed'), { name: 'MongoNetworkError' });
  });
  // A placeholder prevents the missing-variable guard from bypassing the mock.
  const previousUri = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
  t.after(() => {
    if (previousUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = previousUri;
  });

  const health = await request('/api/health', 'GET', { origin: 'https://client.example' });
  assert.equal(health.statusCode, 200);
  assert.deepEqual(JSON.parse(health.body), { status: 'ok' });
  assert.equal(health.headers['access-control-allow-origin'], '*');

  const preflight = await request('/api/tasks', 'OPTIONS', {
    origin: 'https://another.example',
    'access-control-request-method': 'POST',
    'access-control-request-headers': 'content-type,authorization',
  });
  assert.equal(preflight.statusCode, 204);
  assert.equal(preflight.headers['access-control-allow-origin'], '*');
  assert.match(preflight.headers['access-control-allow-methods'], /POST/);
  assert.match(preflight.headers['access-control-allow-headers'], /authorization/);
  assert.equal(connectionAttempts, 0);

  for (let attempt = 0; attempt < 2; attempt++) {
    const tasks = await request('/api/tasks', 'GET', { origin: 'https://client.example' });
    assert.equal(tasks.statusCode, 503);
    assert.equal(tasks.headers['access-control-allow-origin'], '*');
    assert.equal(JSON.parse(tasks.body).message, 'Database unavailable. Please try again later.');
  }
  assert.equal(connectionAttempts, 2);
  const noOrigin = await request('/api/health');
  assert.equal(noOrigin.statusCode, 200);
});
