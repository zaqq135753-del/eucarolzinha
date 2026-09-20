import {funnelConfig as config,httpsLink} from './funnel-config.js';
import {track} from './analytics.js';
import {sessionAttribution} from './tracking.js';
const $=s=>document.querySelector(s),video=$('#story'),play=$('#story-play');
let attribution={};try{attribution=sessionAttribution(location.search,sessionStorage)}catch{}
const emit=(event,extra={})=>track(event,{...attribution,...extra,variant:'direct_presell_review'});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,manual=reduced||!!navigator.connection?.saveData;
let index=0,stopped=false,loading=0,noticeTimer,offerSeen=false,checkoutClicked=false,shown=false,bonusOpened=false;
try{shown=sessionStorage.getItem('starter_shown')==='1'}catch{}
const announce=text=>{clearTimeout(noticeTimer);$('#funnel-notice').textContent=text;$('#funnel-notice').hidden=false;noticeTimer=setTimeout(()=>$('#funnel-notice').hidden=true,4500)};
const reveal=()=>$('#intro-actions').classList.add('visible');
const fallback=()=>{play.hidden=false;reveal()};
function tryPlay(){if(document.hidden||$('#starter-dialog').open)return;const request=loading;video.muted=true;video.defaultMuted=true;video.playsInline=true;try{Promise.resolve(video.play()).then(()=>{if(request===loading)play.hidden=true}).catch(()=>{if(request===loading)fallback()})}catch{fallback()}}
function setStory(n,{user=false}={}){index=(n+config.stories.length)%config.stories.length;loading++;const story=config.stories[index];video.pause();video.poster=story.poster;video.src=story.src;video.load();$('#story-title').textContent=story.title;$('#story-count').textContent=String(index+1).padStart(2,'0')+' / 03';document.querySelectorAll('[data-story]').forEach((b,i)=>{b.style.setProperty('--progress',i<index?'100%':'0%');b.setAttribute('aria-current',i===index?'true':'false')});if(user||!manual){stopped=false;$('#story-pause').textContent='Ⅱ';$('#story-pause').setAttribute('aria-label','Pausar apresentação');tryPlay()}else fallback();emit('story_selected',{index:index+1})}
config.stories.forEach((s,i)=>{const button=document.createElement('button');button.dataset.story=String(i);button.setAttribute('aria-label','Ver vídeo '+(i+1)+': '+s.title);button.onclick=()=>setStory(i,{user:true});$('.story-bars').append(button)});
video.addEventListener('timeupdate',()=>{const pct=Number.isFinite(video.duration)&&video.duration>0?Math.min(100,video.currentTime/video.duration*100):0;document.querySelector('[data-story="'+index+'"]').style.setProperty('--progress',pct+'%');if(video.currentTime>=2.8)reveal()});
video.addEventListener('ended',()=>{emit('story_completed',{index:index+1});if(index<config.stories.length-1&&!manual&&!stopped)setStory(index+1);else{stopped=true;$('#story-pause').textContent='↻';$('#story-pause').setAttribute('aria-label','Rever apresentação');reveal()}});
video.addEventListener('error',fallback);video.addEventListener('playing',()=>{play.hidden=true});
play.onclick=()=>{stopped=false;if(video.error)video.load();tryPlay()};$('#story-next').onclick=()=>setStory(index+1,{user:true});$('#story-prev').onclick=()=>setStory(index-1,{user:true});
$('#story-pause').onclick=()=>{if(video.paused){if(video.ended)setStory(0,{user:true});else{stopped=false;tryPlay()}$('#story-pause').textContent='Ⅱ';$('#story-pause').setAttribute('aria-label','Pausar apresentação')}else{stopped=true;video.pause();$('#story-pause').textContent='▶';$('#story-pause').setAttribute('aria-label','Retomar apresentação')}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!stopped&&!manual)tryPlay()});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)video.pause();else if(!stopped&&!manual&&!document.hidden)tryPlay()}},{threshold:.25}).observe(video);
setStory(0);setTimeout(()=>{reveal();if(video.paused&&!stopped)fallback()},8000);
$('#unlock').onclick=()=>{if(bonusOpened){$('#oferta').scrollIntoView({behavior:reduced?'instant':'smooth'});return}bonusOpened=true;$('#bonus-frame').classList.add('unlocked');$('#bonus-cover').setAttribute('aria-hidden','true');$('#bonus-badge').textContent='PRÉVIA LIBERADA';$('#unlock').textContent='Conhecer o acesso ↗';announce('Sua prévia está aberta ✨');emit('bonus_opened')};
for(const text of config.main.items){const li=document.createElement('li');li.textContent=text;$('#inclusions').append(li)}
const money=value=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),mainUrl=httpsLink(config.main.checkout),starterUrl=httpsLink(config.starter.bot);
if(Number.isFinite(config.main.price)&&config.main.price>0)$('#main-price').textContent=money(config.main.price);
if(mainUrl&&Number.isFinite(config.main.price)&&config.main.price>0){$('#main-pending').hidden=true;$('#main-checkout').hidden=false;$('#main-checkout').href=mainUrl;$('#main-checkout').onclick=()=>{checkoutClicked=true;emit('main_checkout_clicked')}}
if(starterUrl){$('#starter-pending').hidden=true;$('#starter-link').hidden=false;$('#starter-link').href=starterUrl;$('#starter-link').onclick=()=>{checkoutClicked=true;emit('starter_bot_clicked',{price:config.starter.price})}}
const dialog=$('#starter-dialog');
function openStarter(reason,explicit=false){if(dialog.open||(!explicit&&(shown||checkoutClicked)))return;shown=true;try{sessionStorage.setItem('starter_shown','1')}catch{}video.pause();dialog.showModal();emit('starter_offer_viewed',{reason})}
$('#smaller').onclick=()=>openStarter('explicit_choice',true);
$('#close-starter').onclick=()=>dialog.close();$('#decline').onclick=()=>dialog.close();dialog.addEventListener('close',()=>emit('starter_offer_closed'));
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){offerSeen=true;emit('main_offer_viewed');observer.disconnect()}},{threshold:.35});observer.observe($('#oferta'))}
// Desktop signal only. Never block Back, unload, tab close or mobile navigation.
const enteredAt=Date.now();document.addEventListener('mouseleave',e=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches&&e.clientY<=0&&offerSeen&&Date.now()-enteredAt>20000)openStarter('desktop_exit_signal')});
emit('funnel_view');
