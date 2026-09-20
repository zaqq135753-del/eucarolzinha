const enc=new TextEncoder();
export async function hash(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('')}
export async function passwordHash(password,salt){const k=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);return [...new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},k,256))].map(b=>b.toString(16).padStart(2,'0')).join('')}
export const token=()=>[...crypto.getRandomValues(new Uint8Array(32))].map(b=>b.toString(16).padStart(2,'0')).join('');
export function equal(a,b){let diff=a.length^b.length;for(let n=0;n<Math.max(a.length,b.length);n++)diff|=(a.charCodeAt(n)||0)^(b.charCodeAt(n)||0);return diff===0}
export const cookie=req=>req.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('__Host-prive='))?.slice(13)||'';
export const sessionCookie=(value,maxAge)=>'__Host-prive='+value+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age='+maxAge;
export async function limitLogin(bucket,ip){
 const key='limits/'+await hash(ip),now=Date.now();
 for(let n=0;n<5;n++){
  const obj=await bucket.get(key),old=obj?await obj.json():null;
  const state=old&&old.until>now?old:{count:0,until:now+10*60*1000};
  if(state.count>=12)return false;
  state.count++;
  const updated=await bucket.put(key,JSON.stringify(state),{onlyIf:obj?{etagMatches:obj.etag}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
  if(updated)return true;
 }
 return false;
}
