import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {realpath,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=await realpath(fileURLToPath(new URL('./public/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  if(pathname.split(/[\\/]/).some(part=>part.startsWith('.'))){res.writeHead(404);return res.end();}
  const candidate=path.resolve(root,'.'+(pathname==='/'||pathname==='/nova-pressel'?'/index.html':pathname));
  const filename=await realpath(candidate);
  const relative=path.relative(root,filename);
  if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(404);return res.end();}
  const info=await stat(filename);
  if(!info.isFile()){res.writeHead(404);return res.end();}
  let start=0,end=info.size-1,status=200;
  const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(req.headers.range&&req.method==='GET'){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(match&&(match[1]||match[2])){
    if(match[1]){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
    else start=Math.max(0,info.size-Number(match[2]));
   }
   if(!match||(!match[1]&&!match[2])||start>end||start>=info.size||(!match[1]&&Number(match[2])===0)){
    res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();
   }
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length']=String(Math.max(0,end-start+1));res.writeHead(status,headers);
  if(req.method==='HEAD'||info.size===0)return res.end();
  createReadStream(filename,{start,end}).on('error',()=>res.destroy()).pipe(res);
 }catch(error){res.writeHead(error instanceof URIError?400:404);res.end();}
});
server.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log(`Prévia pública: http://127.0.0.1:${server.address().port}`));
