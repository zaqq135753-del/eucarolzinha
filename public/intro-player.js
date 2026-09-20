// A rejected autoplay attempt must leave an explicit user-gesture route.
export function setupIntro(video,button,{reveal,manual=false,doc=document,timeout=8000}={}){
 let complete=false,pending=false,timer;
 video.muted=true;video.defaultMuted=true;video.playsInline=true;
 const offerPlay=reason=>{if(complete)return;button.hidden=false;reveal(3,reason)};
 const attempt=()=>{
  if(complete||pending||doc.hidden)return;
  pending=true;video.muted=true;
  let promise;try{promise=video.play()}catch(e){pending=false;offerPlay('play_error');return}
  Promise.resolve(promise).then(()=>{pending=false;button.hidden=true}).catch(()=>{pending=false;offerPlay('autoplay_blocked')});
 };
 const finish=()=>{complete=true;clearTimeout(timer);timer=null;button.hidden=true;video.pause();reveal(3,'video_finished')};
 video.addEventListener('timeupdate',()=>{const t=video.currentTime;if(t>=2.8)reveal(3,'video');else if(t>=2.1)reveal(2,'video');else if(t>=1.5)reveal(1,'video');if(t>=5)finish()});
 video.addEventListener('ended',finish);
 video.addEventListener('playing',()=>{clearTimeout(timer);timer=null;button.hidden=true});
 video.addEventListener('error',()=>offerPlay('video_error'));
 video.addEventListener('pause',()=>{if(!complete&&!doc.hidden)offerPlay('playback_paused')});
 video.addEventListener('stalled',()=>{if(!complete&&!timer)timer=setTimeout(()=>offerPlay('loading_timeout'),timeout)});
 button.addEventListener('click',()=>{pending=false;if(video.error)video.load();attempt()});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)video.pause();else if(!manual&&!complete)attempt()});
 if(manual){offerPlay('user_preferences')}else{video.autoplay=true;timer=setTimeout(()=>offerPlay('loading_timeout'),timeout);attempt()}
 return {attempt};
}
