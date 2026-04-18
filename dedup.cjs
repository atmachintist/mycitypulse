const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const first = c.indexOf('<BetaFeedback />');
const second = c.indexOf('<BetaFeedback />', first + 1);
if(second !== -1) c = c.slice(0, second) + c.slice(second + 16);
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('done');
