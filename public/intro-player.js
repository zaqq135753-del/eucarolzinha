// Reprodução resiliente em loop infinito do vídeo principal
export function setupIntro(video,button,{reveal,manual=false,doc=document,timeout=8000}={}){
 let complete=false,pending=false,timer;
 video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;
 const attempt=()=>{
  if(pending||doc.hidden)return;
  pending=true;video.muted=true;video.loop=true;
  let promise;try{promise=video.play()}catch(e){pending=false;return}
  Promise.resolve(promise).then(()=>{pending=false;if(button)button.hidden=true}).catch(()=>{pending=false});
 };
 video.addEventListener('timeupdate',()=>{
  const t=video.currentTime;
  if(t>=2.8)reveal(3,'video');
  else if(t>=2.1)reveal(2,'video');
  else if(t>=1.5)reveal(1,'video');
 });
 video.addEventListener('ended',()=>{video.currentTime=0;attempt()});
 video.addEventListener('pause',()=>{if(!doc.hidden){video.play().catch(()=>{})}});
 video.addEventListener('playing',()=>{if(button)button.hidden=true});
 if(button){
  button.addEventListener('click',()=>{attempt()});
 }
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)video.pause();else attempt()});
 video.autoplay=true;
 attempt();
 return {attempt};
}
