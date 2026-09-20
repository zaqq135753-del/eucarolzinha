import {funnelConfig,httpsLink} from './funnel-config.js';
import {setupIntro} from './intro-player.js';
import {siteConfig} from './config.js';import {Hero} from './components.js';import {sessionAttribution,captureAttribution} from './tracking.js';import {track} from './analytics.js';
let attribution;try{attribution=sessionAttribution(location.search,sessionStorage)}catch{attribution=captureAttribution(location.search)}
const emit=(event,extra={})=>track(event,{...attribution,...extra});
document.getElementById('app').innerHTML=Hero();document.title=`${siteConfig.creatorName} — Convite Privé`;
const video=document.getElementById('intro-video'),surface=document.querySelector('.experience'),stages=[...document.querySelectorAll('.stage')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let level=0;
stages.forEach(el=>{el.inert=true;el.setAttribute('aria-hidden','true')});
function reveal(next,reason){if(next<=level)return;level=next;surface.dataset.stage=String(next);stages.forEach(el=>{const rank=el.classList.contains('stage-3')?3:el.classList.contains('stage-2')?2:1;if(rank<=next){el.classList.add('visible');el.inert=false;el.removeAttribute('aria-hidden')}});if(next===3){emit('offer_view',{reason});window.dispatchEvent(new Event('presell:intro-ready'))}}
document.querySelector('.contact').addEventListener('click',()=>emit('offers_navigation')); 
emit('presell_view');
setupIntro(video,document.getElementById('intro-play'),{reveal,manual:reduced||!!navigator.connection?.saveData});

const extra=document.getElementById('extra-video'),extraButton=document.getElementById('extra-play');
extraButton.onclick=()=>{extra.muted=true;extra.play().then(()=>extraButton.hidden=true).catch(()=>{extraButton.hidden=false;extraButton.textContent='▶ Tentar novamente'})};
extra.addEventListener('ended',()=>{extraButton.hidden=false;extraButton.textContent='↻ Ver novamente'});
extra.addEventListener('pause',()=>{if(!extra.ended){extraButton.hidden=false;extraButton.textContent='▶ Continuar prévia'}});
extra.addEventListener('error',()=>{extraButton.hidden=false;extraButton.textContent='▶ Tentar novamente'});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(entries.some(e=>!e.isIntersecting))extra.pause()},{threshold:.2}).observe(extra);
document.addEventListener('visibilitychange',()=>{if(document.hidden)extra.pause()});
const dialog=document.getElementById('short-dialog'),bot=httpsLink(funnelConfig.starter.bot);
if(bot){document.getElementById('short-bot').href=bot;document.getElementById('short-bot').hidden=false;document.getElementById('short-bot-pending').hidden=true}
let clicked=false,seen=false,shown=false;const arrived=Date.now();try{shown=sessionStorage.getItem('short_starter_shown')==='1'}catch{}
function openStarter(explicit=false){if(dialog.open||document.getElementById('primary-dialog').open||(!explicit&&(shown||clicked)))return;shown=true;try{sessionStorage.setItem('short_starter_shown','1')}catch{}extra.pause();video.pause();dialog.showModal();emit('starter_offer_viewed',{reason:explicit?'choice':'desktop_exit_signal'})}
document.getElementById('short-starter').onclick=()=>openStarter(true);
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());document.getElementById('short-decline').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
document.querySelectorAll('[data-offer]').forEach(a=>a.addEventListener('click',()=>{clicked=true;emit('offer_consultation_clicked',{offer:a.dataset.offer})}));
document.getElementById('short-bot').addEventListener('click',()=>emit('starter_bot_clicked',{path:'secondary'}));
if('IntersectionObserver'in window){const offersObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){seen=true;emit('main_offers_viewed');offersObserver.disconnect()}},{threshold:.3});offersObserver.observe(document.getElementById('acessos'))}
document.addEventListener('mouseleave',e=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches&&e.clientY<=0&&seen&&Date.now()-arrived>20000)openStarter()});

const mainBot=httpsLink(funnelConfig.main.bot),primaryDialog=document.getElementById('primary-dialog');
document.querySelectorAll('[data-main-bot]').forEach(a=>{if(mainBot){a.href=mainBot;a.target='_top'}a.addEventListener('click',e=>{clicked=true;if(!mainBot){e.preventDefault();video.pause();extra.pause();primaryDialog.showModal();emit('main_invite_pending')}else emit('main_bot_clicked')})});
primaryDialog.addEventListener('click',e=>{if(e.target!==primaryDialog)return;const r=primaryDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)primaryDialog.close()});
// Two measured text transitions, then a stable heading. No endless text cycling.
let phraseStarted=false;
function startPhrases(){if(phraseStarted||reduced)return;phraseStarted=true;const el=document.querySelector('.motion-phrase');let index=0;const phrases=['No seu tempo.','Do seu jeito.'];const change=()=>{if(document.hidden){setTimeout(change,1500);return}el.animate([{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(-12px)',filter:'blur(5px)'}],{duration:350,easing:'ease-in',fill:'forwards'}).finished.then(()=>{el.textContent=phrases[index++];return el.animate([{opacity:0,transform:'translateY(14px)',filter:'blur(5px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'}).finished}).then(()=>{if(index<phrases.length)setTimeout(change,4800)}).catch(()=>{})};setTimeout(change,4800)}
if(level===3)startPhrases();else window.addEventListener('presell:intro-ready',startPhrases,{once:true});
const revealNodes=document.querySelectorAll('.short-gallery,.portal-copy,.invitation-card');
if(!reduced&&'IntersectionObserver'in window){const motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-entered');motionObserver.unobserve(entry.target)}}),{threshold:.12});revealNodes.forEach(el=>{el.classList.add('motion-pending');motionObserver.observe(el)})}
const strip=document.querySelector('.media-strip'),figures=[...strip.children],galleryControls=document.createElement('div');galleryControls.className='gallery-controls';galleryControls.setAttribute('aria-label','Navegar pelas prévias');figures.forEach((fig,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Ver prévia '+(i+1));b.textContent=String(i+1).padStart(2,'0');b.onclick=()=>strip.scrollTo({left:fig.offsetLeft-strip.firstElementChild.offsetLeft,behavior:reduced?'instant':'smooth'});galleryControls.append(b)});strip.after(galleryControls);
