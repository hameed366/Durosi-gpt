// Render the approved Durusi SVG into generated native icon resources.
// Run AFTER "npx cap sync" so native project assets exist.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const approved=path.join(__dirname,'../www/durusi-approved.png');
if(!fs.existsSync(approved))throw Error('Missing approved icon: upload www/durusi-approved.png first');
const src=fs.readFileSync(approved);
async function png(file,size){await fs.promises.mkdir(path.dirname(file),{recursive:true});await sharp(src,{density:400}).resize(size,size).png().toFile(file);console.log('ICON',file,size)}
(async()=>{
 const ios=path.join(__dirname,'../ios/App/App/Assets.xcassets/AppIcon.appiconset');
 if(fs.existsSync(ios)){
  const meta=JSON.parse(fs.readFileSync(path.join(ios,'Contents.json'),'utf8'));
  let count=0;
  for(const img of meta.images||[]){
   if(!img.filename)continue;
   const pts=Number(String(img.size||'1024x1024').split('x')[0]);
   const scale=Number(String(img.scale||'1x').replace('x',''));
   const size=Math.round(pts*scale);
   if(!Number.isFinite(size)||size<16||size>2048)throw Error('Invalid iOS icon size');
   await png(path.join(ios,img.filename),size);count++;
  }
  if(!count)throw Error('No iOS icon filenames found in Contents.json');
 }
 const android=path.join(__dirname,'../android/app/src/main/res');
 if(fs.existsSync(android)){
  let count=0;
  for(const dir of fs.readdirSync(android)){
   const m=/^mipmap-(mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)$/.exec(dir);
   if(!m)continue;
   const size={mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192}[m[1]];
   for(const filename of fs.readdirSync(path.join(android,dir))){
    if(/^ic_launcher(?:_round|_foreground)?\.png$/.test(filename)){await png(path.join(android,dir,filename),filename.includes('foreground')?Math.round(size*108/48):size);count++}
   }
  }
  if(!count)throw Error('No Android launcher PNGs found');
 }
 if(!fs.existsSync(ios)&&!fs.existsSync(android))throw Error('No native project found');
})().catch(e=>{console.error(e);process.exit(1)});
