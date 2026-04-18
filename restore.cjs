const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const bad = 'imp<div style={{width:"100%",maxWidth:720,display:"flex",flexDirection:"column",alignItems:"center",margin:"0 auto"}}>ort';
if(c.includes(bad)) c = c.replace(bad, 'import');
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('fixed');
