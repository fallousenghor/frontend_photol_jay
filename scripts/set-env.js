const fs = require('fs');
const path = require('path');

// Read API URL from env var set in Vercel (API_URL).
// If not provided, default to the production backend URL (safer than pointing to localhost
// when the app is deployed). We also print a clear warning so that build logs show missing env.
const defaultProdApi = 'https://backend-photo-jay.onrender.com';
const apiUrl = process.env.API_URL || defaultProdApi;

if (!process.env.API_URL) {
  console.warn(`WARNING: API_URL not set - defaulting to ${defaultProdApi}. Set API_URL in Vercel to override.`);
}

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
