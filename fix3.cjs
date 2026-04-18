const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const idx = c.indexOf('minHeight:"100vh"');
const insertAfter = c.indexOf('}}}>', idx) + 4;
const wrapper = '<div style={{width:"100%",maxWidth:720,display:"flex",flexDirection:"column",alignItems:"center",margin:"0 auto"}}>';
c = c.slice(0, insertAfter) + wrapper + c.slice(insertAfter);
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('done');
