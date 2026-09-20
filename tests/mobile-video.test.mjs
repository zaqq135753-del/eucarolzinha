import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {setupIntro} from '../public/intro-player.js';
for(const path of ['/assets/carolina-intro-mobile.mp4','/assets/preview-one.mp4','/assets/preview-two.mp4']){
 const req=(range,method='GET')=>worker.fetch(new Request('https://example.test'+path,{method,headers:range?{Range:range}:{}}),{});
 const full=await req();const bytes=new Uint8Array(await full.arrayBuffer());
 const r=await req('bytes=0-1');assert.equal(r.status,206);assert.equal(r.headers.get('Content-Range'),'bytes 0-1/'+bytes.length);assert.equal(r.headers.get('Accept-Ranges'),'bytes');assert.deepEqual(new Uint8Array(await r.arrayBuffer()),bytes.slice(0,2));
 const tail=await req('bytes=-24');assert.equal(tail.status,206);assert.deepEqual(new Uint8Array(await tail.arrayBuffer()),bytes.slice(-24));
 assert.equal((await req('bytes=999999999-')).status,416);
 const head=await req(null,'HEAD');assert.equal(head.headers.get('Content-Length'),String(bytes.length));assert.equal((await head.arrayBuffer()).byteLength,0);
}
class Video extends EventTarget{currentTime=0;paused=true;calls=0;blocked=false;play(){this.calls++;if(this.blocked)return Promise.reject(new Error('NotAllowedError'));this.paused=false;this.dispatchEvent(new Event('playing'));return Promise.resolve()}pause(){this.paused=true;this.dispatchEvent(new Event('pause'))}load(){}}
const settle=()=>new Promise(r=>setImmediate(r));
let video=new Video(),button=new EventTarget(),doc=new EventTarget(),levels=[];button.hidden=true;video.blocked=true;
setupIntro(video,button,{doc,reveal:n=>levels.push(n),timeout:10});await settle();assert.equal(button.hidden,false);video.blocked=false;button.dispatchEvent(new Event('click'));await settle();assert.equal(button.hidden,true);assert.equal(video.paused,false);video.currentTime=3;video.dispatchEvent(new Event('timeupdate'));assert.ok(levels.includes(3));video.currentTime=5;video.dispatchEvent(new Event('timeupdate'));assert.equal(video.paused,true);assert.equal(button.hidden,true);
video=new Video();button=new EventTarget();doc=new EventTarget();setupIntro(video,button,{doc,manual:true,reveal:()=>{}});assert.equal(video.calls,0);assert.equal(button.hidden,false);button.dispatchEvent(new Event('click'));await settle();assert.equal(video.calls,1);video.currentTime=5;video.dispatchEvent(new Event('timeupdate'));
console.log('PASS: public video byte ranges, HEAD, invalid ranges; blocked autoplay recovery; manual playback; timed reveal and stop.');
