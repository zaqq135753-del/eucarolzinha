import fs from 'node:fs';
const files={};const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.mp4':'video/mp4'};
for(const name of fs.readdirSync('public')){if(fs.statSync('public/'+name).isFile()){const ext=name.slice(name.lastIndexOf('.'));files['/'+name]={text:fs.readFileSync('public/'+name,'utf8'),type:mime[ext]||'text/plain'}}}
for(const name of ['luna-poster.webp','carolina-intro-mobile.mp4','preview-one.mp4','preview-two.mp4','preview-one.webp','preview-two.webp','story-1.mp4','story-2.mp4','story-3.mp4','story-1.webp','story-2.webp','story-3.webp','bonus-photo.webp','welcome-photo.webp','short-photo-1.webp','short-photo-2.webp']){files['/assets/'+name]={base64:fs.readFileSync('public/assets/'+name).toString('base64'),type:mime[name.slice(name.lastIndexOf('.'))]}}
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
fs.writeFileSync('dist/server/files.js','export const files='+JSON.stringify(files)+';');
fs.copyFileSync('src/worker.js','dist/server/index.js');fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');

const catalog={collections:[
 {id:'espelho',title:'Pelo espelho',description:'Um olhar, outro ângulo. A coleção completa para assistir no seu tempo.',published:true,featured:true,coverId:'cover-one'},
 {id:'luz',title:'Entre luz e sombra',description:'Detalhes de um segundo momento, agora dentro do seu espaço.',published:true,featured:false,coverId:'cover-two'}
],items:[
 {id:'video-one',collectionId:'espelho',title:'Pelo espelho',type:'video',mime:'video/mp4',posterId:'cover-one',duration:12.333,createdAt:'2026-09-20T00:00:00Z'},
 {id:'video-two',collectionId:'luz',title:'Entre luz e sombra',type:'video',mime:'video/mp4',posterId:'cover-two',duration:11.5,createdAt:'2026-09-20T00:01:00Z'},
 {id:'cover-one',collectionId:'espelho',title:'Capa — Pelo espelho',type:'cover',mime:'image/webp'},
 {id:'cover-two',collectionId:'luz',title:'Capa — Entre luz e sombra',type:'cover',mime:'image/webp'}
]};
const privateFiles={};for(const [id,name] of [['video-one','collection-one.mp4'],['video-two','collection-two.mp4'],['cover-one','cover-one.webp'],['cover-two','cover-two.webp']])privateFiles[id]=fs.readFileSync('private-media/'+name).toString('base64');
fs.writeFileSync('dist/server/private.js','export const catalog='+JSON.stringify(catalog)+';export const privateFiles='+JSON.stringify(privateFiles)+';');
fs.copyFileSync('src/auth.js','dist/server/auth.js');
