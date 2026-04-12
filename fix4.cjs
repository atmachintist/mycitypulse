const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace('imp<div style={{width:"100%",maxWidth:720,display:"flex",flexDirection:"column",alignItems:"center",margin:"0 auto"}}>ort', 'import');
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('done');
