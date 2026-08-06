import { buildApp } from './src/app.js';

async function run() {
  const app = await buildApp();
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/logout',
    headers: {
      cookie: 'ajs_anonymous_id=822749ee-dedd-4a7c-8ba3-060da15a4db8; better-auth.session_token=vpLXEGG8U9vjOjLszXEvkWGbCgRxflgt.bQ8pGBhS8B%2FwPp4OGBMAPXSsk27t08EP1C9yDIAS0bM%3D; refresh_token=1b4290ec-9846-4e9b-b1db-bdbb6295310c; lms_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJUR29KQnR3MUxINmRfR0ZYQzhiUSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTk0NjE1Mn0.Se3sbp2J7A_6D0JsyIHoN72x9BTCRIuDpcZkSVTF23A'
    }
  });
  console.log(res.statusCode);
  console.log(res.body);
  process.exit(0);
}
run();
