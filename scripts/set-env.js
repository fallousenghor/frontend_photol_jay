const fs = require('fs');
const path = require('path');

// Read API URL from env var set in Vercel (API_URL). Fallback to localhost for local builds.
const apiUrl = process.env.API_URL || 'http://localhost:3007';

const targetDir = path.join(__dirname, '..', 'src', 'environments');
const targetFile = path.join(targetDir, 'environment.prod.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetFile, content, { encoding: 'utf8' });
console.log(`Wrote ${targetFile} with apiUrl=${apiUrl}`);
