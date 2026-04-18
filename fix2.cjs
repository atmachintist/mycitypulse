const fs = require('fs');
let lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
// Add centring wrapper div after line 718 (index 717)
lines.splice(718, 0, '      <div style={{width:"100%",maxWidth:720,display:"flex",flexDirection:"column",alignItems:"center",margin:"0 auto"}}>');
// Add closing div before the last </div> of App (find it from the end)
for(let i=lines.length-1;i>=0;i--){
  if(lines[i].trim()==='</div>'){
    lines.splice(i, 0, '      </div>');
    break;
  }
}
fs.writeFileSync('src/App.jsx', lines.join('\n'), 'utf8');
console.log('done');
