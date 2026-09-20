import {files} from './files.js';
import {catalog,privateFiles} from './private.js';
import {hash,passwordHash,token,equal,cookie,sessionCookie,limitLogin} from './auth.js';
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
const read=async(b,k)=>{const o=await b.get(k);return o?o.json():null};
const put=(b,k,v)=>b.put(k,JSON.stringify(v),{httpMetadata:{contentType:'application/json'}});
async function list(b,prefix){let cursor;const all=[];do{const p=await b.list({prefix,cursor,limit:500});all.push(...p.objects);cursor=p.truncated?p.cursor:undefined}while(cursor);return (await Promise.all(all.map(o=>read(b,o.key)))).filter(Boolean)}
const key=s=>encodeURIComponent(s.toLowerCase()),live=c=>c?.published&&(!c.publishAt||Date.parse(c.publishAt)<=Date.now());
const itemFor=async(b,id)=>await read(b,'items/'+id)||catalog.items.find(i=>i.id===id);
const collectionFor=async(b,id)=>await read(b,'collections/'+id)||catalog.collections.find(i=>i.id===id);
const merge=(base,stored)=>[...new Map([...base,...stored].map(x=>[x.id,x])).values()];
async function config(b,env){return await read(b,'settings/access')||{username:env.MEMBER_USERNAME,hash:env.MEMBER_PASSWORD_HASH,salt:env.MEMBER_PASSWORD_SALT,version:env.MEMBER_PASSWORD_HASH}}
async function body(req){if(Number(req.headers.get('Content-Length'))>10000)fail('Solicitação muito grande.',413);return req.json()}
export default {async fetch(req,env){try{
 const u=new URL(req.url),p=u.pathname,b=env.BUCKET;
 const uid=req.headers.get('oai-authenticated-user-id'),email=req.headers.get('oai-authenticated-user-email')?.toLowerCase();
 const admin=!!uid&&!!email&&!!env.ADMIN_EMAIL&&equal(email,env.ADMIN_EMAIL.trim().toLowerCase());
 const isApi=p.startsWith('/api/')||p.startsWith('/media/');
 if(isApi){
  if(!b)return json({error:'Espaço temporariamente indisponível. Tente novamente.'},503);
  if(!['GET','HEAD'].includes(req.method)&&req.headers.get('Origin')!==u.origin)return json({error:'Origem inválida.'},403);
  const credentials=await config(b,env);
  if(p==='/api/login'){
   if(req.method!=='POST')return json({error:'Método não permitido.'},405);
   if(!await limitLogin(b,req.headers.get('CF-Connecting-IP')||'unknown'))return json({error:'Muitas tentativas. Aguarde dez minutos antes de tentar novamente.'},429);
   const v=await body(req);
   if(typeof v.username!=='string'||typeof v.password!=='string'||v.password.length>200)fail('Usuário ou senha incorretos.',401);
   if(!credentials.hash||!credentials.salt)return json({error:'O acesso está sendo preparado. Fale com o atendimento.'},503);
   const derived=await passwordHash(v.password,credentials.salt);
   if(!equal(derived,credentials.hash)||!equal(v.username.trim().toLowerCase(),credentials.username))fail('Usuário ou senha incorretos.',401);
   const raw=token(),sessionId=await hash(raw),expiresAt=Date.now()+30*86400000;
   // Each authenticated browser session has its own favorites and watch history.
   await put(b,'sessions/'+sessionId,{id:crypto.randomUUID(),expiresAt,version:credentials.version});
   return json({ok:true},200,{'Set-Cookie':sessionCookie(raw,30*86400)});
  }
  const raw=cookie(req);let session=null;
  if(/^[a-f0-9]{64}$/.test(raw)){
   session=await read(b,'sessions/'+await hash(raw));
   if(!session||session.expiresAt<=Date.now()||session.version!==credentials.version)session=null;
  }
  if(p==='/api/logout'){
   if(req.method!=='POST')return json({error:'Método não permitido.'},405);
   if(/^[a-f0-9]{64}$/.test(raw))await b.delete('sessions/'+await hash(raw));
   return json({ok:true},200,{'Set-Cookie':sessionCookie('',0)});
  }
  // SIWC is reserved for administration. Member cookies can never grant admin.
  const user=admin?{id:uid,email}:session?{id:session.id,email:null}:null;
  if(!user)return json({error:'Entre para continuar.'},401);
  if(p==='/api/me')return json({admin,active:true,email:admin?email:null,shared:!admin,displayName:admin?'Administração':'Membro Privé'});
  if(p.startsWith('/api/admin/')){
   if(!admin)return json({error:'Acesso restrito à administração.'},403);
   if(p==='/api/admin/data'&&req.method==='GET')return json({members:await list(b,'members/'),collections:merge(catalog.collections,await list(b,'collections/')),items:merge(catalog.items,await list(b,'items/')),calls:await list(b,'calls/'),sharedUsername:credentials.username||'',sharedConfigured:!!credentials.hash});
   if(req.method!=='POST')return json({error:'Método não permitido.'},405);
   if(p==='/api/admin/upload'){
    const form=await req.formData(),file=form.get('file'),collectionId=String(form.get('collectionId')||'');
    if(!file||!['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(file.type)||file.size>50*1024*1024)fail('Use JPG, PNG, WebP, MP4 ou WebM de até 50 MB.');
    if(!await collectionFor(b,collectionId))fail('Selecione uma coleção.');
    const id=crypto.randomUUID();await b.put('files/'+id,file.stream(),{httpMetadata:{contentType:file.type}});
    const item={id,collectionId,title:file.name.replace(/\.[^.]+$/,''),type:file.type.startsWith('video/')?'video':'photo',mime:file.type,createdAt:new Date().toISOString()};
    await put(b,'items/'+id,item);return json(item);
   }
   const v=await body(req);
   if(p==='/api/admin/access'){
    if(!/^[a-z0-9._-]{3,40}$/.test(v.username||'')||typeof v.password!=='string'||v.password.length<12||v.password.length>200)fail('Use um usuário de 3 a 40 caracteres e uma senha de pelo menos 12 caracteres.');
    const salt=token();await put(b,'settings/access',{username:v.username,salt,hash:await passwordHash(v.password,salt),version:token()});
    return json({ok:true,message:'Credenciais atualizadas. As sessões de membros anteriores foram encerradas.'});
   }
   if(p==='/api/admin/collection'){
    const id=v.id||crypto.randomUUID();if(!/^[\w-]+$/.test(id)||!v.title?.trim())fail('Informe o nome da coleção.');
    if(v.publishAt&&!Number.isFinite(Date.parse(v.publishAt)))fail('Data inválida.');
    const c={id,title:String(v.title).slice(0,100),description:String(v.description||'').slice(0,500),published:!!v.published,publishAt:v.publishAt||null,featured:!!v.featured,coverId:v.coverId||null};
    if(c.coverId){const cover=await itemFor(b,c.coverId);if(!cover||cover.collectionId!==id||!['photo','cover'].includes(cover.type))fail('Escolha uma imagem desta coleção.')}
    await put(b,'collections/'+id,c);return json(c);
   }
   return json({error:'Operação não encontrada.'},404);
  }
  if(p==='/api/library'){
   const collections=merge(catalog.collections,await list(b,'collections/')).filter(live),ids=new Set(collections.map(c=>c.id));
   return json({collections,items:merge(catalog.items,await list(b,'items/')).filter(i=>ids.has(i.collectionId)&&i.type!=='cover'),favorites:await list(b,'favorites/'+key(user.id)+'/'),progress:await list(b,'progress/'+key(user.id)+'/')});
  }
  if(p.startsWith('/media/')){
   const id=p.split('/')[2];if(!/^[\w-]+$/.test(id||''))fail('Arquivo não encontrado.',404);
   const item=await itemFor(b,id);if(!item)fail('Arquivo não encontrado.',404);
   if(!admin&&!live(await collectionFor(b,item.collectionId)))fail('Arquivo indisponível.',403);
   const headers=new Headers({'Content-Type':item.mime,'Cache-Control':'private, no-store','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'});
   if(privateFiles[id]){
    const bytes=Uint8Array.from(atob(privateFiles[id]),c=>c.charCodeAt(0)),size=bytes.length,range=req.headers.get('Range');let start=0,end=size-1,status=200;
    if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
     if(!m[1])start=Math.max(0,size-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]))}
     if(start>end||start>=size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
     status=206;headers.set('Content-Range','bytes '+start+'-'+end+'/'+size);
    }
    headers.set('Content-Length',String(end-start+1));return new Response(req.method==='HEAD'?null:bytes.subarray(start,end+1),{status,headers});
   }
   const o=await b.get('files/'+id,{range:req.headers});if(!o)fail('Arquivo indisponível.',404);
   let status=200;if(o.range&&'offset'in o.range&&'length'in o.range){headers.set('Content-Range',`bytes ${o.range.offset}-${o.range.offset+o.range.length-1}/${o.size}`);headers.set('Content-Length',String(o.range.length));status=206}else headers.set('Content-Length',String(o.size));
   return new Response(req.method==='HEAD'?null:o.body,{status,headers});
  }
  if(req.method!=='POST')return json({error:'Operação não encontrada.'},404);
  const v=await body(req);
  if(p==='/api/favorite'||p==='/api/progress'){
   const item=await itemFor(b,String(v.id));if(!item||item.type==='cover'||!live(await collectionFor(b,item.collectionId)))fail('Conteúdo indisponível.',404);
   const k=(p==='/api/favorite'?'favorites/':'progress/')+key(user.id)+'/'+item.id;
   if(p==='/api/favorite'){if(v.saved)await put(b,k,{id:item.id});else await b.delete(k)}
   else await put(b,k,{id:item.id,seconds:Math.max(0,Math.min(Number(v.seconds)||0,86400)),completed:!!v.completed,updatedAt:Date.now()});
   return json({ok:true});
  }
  return json({error:'Não encontrado.'},404);
 }
 const memberRoute=p==='/entrar'||p.startsWith('/privado')||p==='/admin';
 const f=files[memberRoute?'/members.html':p==='/nova-pressel'?'/index.html':p==='/'?'/index.html':p];if(!f)return new Response('Não encontrado',{status:404});
 if(f.type==='video/mp4'){
  const bytes=Uint8Array.from(atob(f.base64),c=>c.charCodeAt(0)),size=bytes.length;
  const headers=new Headers({'Content-Type':f.type,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'});
  let start=0,end=size-1,status=200;const range=req.headers.get('Range');
  if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);
   if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
   if(!m[1])start=Math.max(0,size-Number(m[2]));else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]))}
   if(start>end||start>=size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
   status=206;headers.set('Content-Range','bytes '+start+'-'+end+'/'+size);
  }
  headers.set('Content-Length',String(end-start+1));return new Response(req.method==='HEAD'?null:bytes.subarray(start,end+1),{status,headers});
 }
 return new Response(f.text??Uint8Array.from(atob(f.base64),c=>c.charCodeAt(0)),{headers:{'Content-Type':f.type,'Cache-Control':memberRoute?'no-store':p.endsWith('.mp4')?'public,max-age=86400':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}catch(e){console.error('request failed',e.message);return json({error:e.status?e.message:'Não foi possível concluir. Tente novamente.'},e.status||500)}}};
