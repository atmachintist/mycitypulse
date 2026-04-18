const fs = require('fs');
const c = fs.readFileSync('src/App.jsx', 'utf8');
const lines = c.split('\n');
const appDiv = lines.findIndex(l => l.includes('minHeight:"100vh"'));
console.log('App div at line:', appDiv+1);
console.log('Content:', lines[appDiv].substring(0, 80));
