import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const {default:worker}=await import('../dist/server/index.js');
const {passwordHash,hash}=await import('../src/auth.js');
class Bucket{
 map=new Map();seq=0;
 async get(key){const x=this.map.get(key);if(!x)return null;return {etag:x.etag,json:async()=>JSON.parse(x.value)}}
 async put(key,value,options={}){const old=this.map.get(key),c=options.onlyIf;if(c?.etagMatches&&old?.etag!==c.etagMatches)return null;if(c?.etagDoesNotMatch==='*'&&old)return null;const x={value,etag:String(++this.seq)};this.map.set(key,x);return {etag:x.etag}}
 async delete(key){this.map.delete(key)}
 async list({prefix}){return {objects:[...this.map.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key})),truncated:false}}
}
const b=new Bucket(),password='Test-private-password-Only!',env={BUCKET:b,ADMIN_EMAIL:'owner@example.test',MEMBER_USERNAME:'membro',MEMBER_PASSWORD_SALT:'test-salt',MEMBER_PASSWORD_HASH:await passwordHash(password,'test-salt')};
const request=(path,body,cookie='',headers={})=>worker.fetch(new Request('https://site.test'+path,{method:body?'POST':'GET',headers:{Origin:'https://site.test','Content-Type':'application/json',Cookie:cookie,'CF-Connecting-IP':'127.0.0.1',...headers},body:body?JSON.stringify(body):undefined}),env);
assert.equal((await request('/api/me')).status,401);
assert.equal((await request('/media/video-one')).status,401);
assert.equal((await request('/private-media/collection-one.mp4')).status,404);
assert.equal((await request('/private.js')).status,404);
assert.equal((await request('/api/login',{username:'membro',password:'wrong'})).status,401);
assert.equal((await request('/api/login',{username:'membro',password},{},{Origin:'https://attacker.test'})).status,403);
let r=await request('/api/login',{username:'membro',password});assert.equal(r.status,200);
let set=r.headers.get('Set-Cookie');assert.match(set,/HttpOnly; Secure; SameSite=Lax/);const cookie=set.split(';')[0];
let who=await (await request('/api/me',null,cookie)).json();assert.equal(who.admin,false);assert.equal(who.email,null);
assert.equal((await request('/api/admin/data',null,cookie)).status,403);
let library=await (await request('/api/library',null,cookie)).json();assert.equal(library.items.filter(i=>i.type==='video').length,2);assert.ok(library.items.every(i=>i.type!=='cover'));
r=await request('/media/video-one',null,cookie,{Range:'bytes=0-99'});assert.equal(r.status,206);assert.equal((await r.arrayBuffer()).byteLength,100);assert.match(r.headers.get('Content-Range'),/^bytes 0-99\//);assert.equal(r.headers.get('Cache-Control'),'private, no-store');
r=await request('/media/video-two',null,cookie,{Range:'bytes=-100'});assert.equal(r.status,206);assert.equal((await r.arrayBuffer()).byteLength,100);
assert.equal((await request('/media/video-one',null,cookie,{Range:'bytes=999999999-'})).status,416);
assert.equal((await request('/api/favorite',{id:'video-one',saved:true},cookie)).status,200);
r=await request('/api/login',{username:'membro',password});const second=r.headers.get('Set-Cookie').split(';')[0];library=await (await request('/api/library',null,second)).json();assert.equal(library.favorites.length,0);library=await (await request('/api/library',null,cookie)).json();assert.equal(library.favorites.length,1);
assert.equal((await request('/api/progress',{id:'video-one',seconds:5},cookie)).status,200);
assert.equal((await request('/api/logout',{},cookie)).status,200);assert.equal((await request('/api/me',null,cookie)).status,401);
const admin={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@example.test'};
assert.equal((await request('/api/admin/access',{username:'membro',password:'Updated-test-password'},'',admin)).status,200);assert.equal((await request('/api/me',null,second)).status,401);
assert.equal((await request('/api/admin/collection',{id:'espelho',title:'Pelo espelho',published:false},'',admin)).status,200);
r=await request('/api/login',{username:'membro',password:'Updated-test-password'});const third=r.headers.get('Set-Cookie').split(';')[0];assert.equal((await request('/media/video-one',null,third)).status,403);
const raw=third.split('=')[1],key='sessions/'+await hash(raw),expired=await (await b.get(key)).json();expired.expiresAt=0;await b.put(key,JSON.stringify(expired));assert.equal((await request('/api/me',null,third)).status,401);
for(let i=0;i<12;i++)await request('/api/login',{username:'bad',password:'wrong'},'',{'CF-Connecting-IP':'limit-test'});assert.equal((await request('/api/login',{username:'bad',password:'wrong'},'',{'CF-Connecting-IP':'limit-test'})).status,429);
console.log('PASS: login, isolation, private media/ranges, admin separation, logout, rotation, expiry, unpublished media, rate limiting.');
