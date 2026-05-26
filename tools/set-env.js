const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || '/api/v1';

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(target, content);
console.log(`[set-env] API_URL set to: ${apiUrl}`);
