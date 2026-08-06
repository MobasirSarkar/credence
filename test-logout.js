import { buildApp } from './apps/api/src/app.js';

async function run() {
  const app = await buildApp();
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/logout'
  });
  console.log(res.statusCode);
  console.log(res.body);
}
run();
