const fs = require('fs');
let html = fs.readFileSync('src/app/app.html', 'utf8');
html = html
  .replace(/rounded-3xl/g, 'rounded-lg')
  .replace(/rounded-2xl/g, 'rounded-md')
  .replace(/rounded-xl/g, 'rounded-md')
  .replace(/rounded-\[10px\]/g, 'rounded-md')
  .replace(/rounded-\[20px\]/g, 'rounded-md')
  .replace(/rounded-\[24px\]/g, 'rounded-md')
  .replace(/rounded-\[32px\]/g, 'rounded-lg');
fs.writeFileSync('src/app/app.html', html);
console.log('done');
