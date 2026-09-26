import {funnelConfig,httpsLink} from './funnel-config.js';
import {setupIntro} from './intro-player.js';
import {siteConfig} from './config.js';
import {Hero} from './components.js';
import {sessionAttribution,captureAttribution} from './tracking.js';
import {track} from './analytics.js';

let attribution;
try {
  attribution = sessionAttribution(location.search, sessionStorage);
} catch {
  attribution = captureAttribution(location.search);
}

const emit = (event, extra = {}) => track(event, {...attribution, ...extra});

document.getElementById('app').innerHTML = Hero();
document.title = `${siteConfig.creatorName} — Experiência Privé`;

const video = document.getElementById('intro-video');
const surface = document.querySelector('.experience');
const stages = [...document.querySelectorAll('.stage')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let level = 0;
if (surface) surface.dataset.stage = '0';

stages.forEach(el => {
  el.inert = true;
  el.setAttribute('aria-hidden', 'true');
});

function reveal(next, reason) {
  if (next <= level) return;
  level = next;
  if (surface) surface.dataset.stage = String(next);
  stages.forEach(el => {
    const rank = el.classList.contains('stage-3') ? 3 : el.classList.contains('stage-2') ? 2 : 1;
    if (rank <= next) {
      el.classList.add('visible');
      el.inert = false;
      el.removeAttribute('aria-hidden');
    }
  });
  if (next === 3) {
    document.body.classList.add('funnel-unlocked');
    emit('offer_view', {reason});
    window.dispatchEvent(new Event('presell:intro-ready'));
  }
}

// Se o lead rolar a tela antes, destrava o funil imediatamente
window.addEventListener('scroll', () => {
  if (window.scrollY > 50 && level < 3) {
    reveal(1, 'scroll');
    reveal(2, 'scroll');
    reveal(3, 'scroll');
  }
}, {passive: true});

document.querySelector('.apple-button, .contact')?.addEventListener('click', () => emit('offers_navigation'));
emit('presell_view');

setupIntro(video, document.getElementById('intro-play'), {
  reveal,
  manual: reduced || !!navigator.connection?.saveData
});

if (video) {
  video.addEventListener('play', () => pauseAllVideos(video));
}

// Video Teasers in Gallery
const galleryCards = document.querySelectorAll('[data-video-card]');
const allGalleryVideos = [...galleryCards].map(c => c.querySelector('.gallery-video')).filter(Boolean);

function pauseAllVideos(except = null) {
  if (video && video !== except) video.pause();
  allGalleryVideos.forEach(v => {
    if (v !== except && !v.paused) v.pause();
  });
}

galleryCards.forEach(card => {
  const v = card.querySelector('.gallery-video');
  const btn = card.querySelector('.gallery-play-btn');
  const lbl = btn?.querySelector('.play-label');
  if (!v || !btn) return;

  const togglePlay = () => {
    if (v.paused) {
      pauseAllVideos(v);
      v.muted = false;
      v.play()
        .then(() => {
          card.classList.add('is-playing');
          btn.hidden = true;
          emit('teaser_play', {src: v.currentSrc});
        })
        .catch(() => {
          v.muted = true;
          v.play()
            .then(() => {
              card.classList.add('is-playing');
              btn.hidden = true;
              emit('teaser_play', {src: v.currentSrc, muted: true});
            })
            .catch(() => {
              btn.hidden = false;
              if (lbl) lbl.textContent = 'Tentar novamente';
            });
        });
    } else {
      v.pause();
    }
  };

  card.addEventListener('click', e => {
    if (e.target.closest('figcaption')) return;
    togglePlay();
  });

  v.addEventListener('pause', () => {
    card.classList.remove('is-playing');
    btn.hidden = false;
    if (v.ended) {
      if (lbl) lbl.textContent = '↻ Ver novamente';
      emit('teaser_completed', {src: v.currentSrc});
    } else {
      if (lbl) lbl.textContent = '▶ Assistir com áudio';
    }
  });

  v.addEventListener('ended', () => {
    card.classList.remove('is-playing');
    btn.hidden = false;
    if (lbl) lbl.textContent = '↻ Ver novamente';
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (entries.some(e => !e.isIntersecting)) v.pause();
    }, {threshold: 0.2}).observe(v);
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseAllVideos();
});

// Apple Dynamic Island state toggling & click
const dynamicIsland = document.getElementById('dynamic-island');
const islandText = document.getElementById('island-text');
if (dynamicIsland) {
  const states = [
    'Online no WhatsApp agora',
    '💬 1 novo áudio de prévia liberado',
    '🔥 1.482 membros ativos hoje'
  ];
  let stateIndex = 0;
  setInterval(() => {
    if (document.hidden) return;
    stateIndex = (stateIndex + 1) % states.length;
    if (islandText) {
      islandText.style.opacity = '0';
      setTimeout(() => {
        islandText.textContent = states[stateIndex];
        islandText.style.opacity = '1';
      }, 200);
    }
  }, 4500);

  dynamicIsland.addEventListener('click', () => {
    emit('dynamic_island_clicked');
    window.open('https://wa.me/message/AYCUNLYYIOSZO1', '_blank', 'noopener');
  });
}

// Interactive Lead Preference Picker (Alta Interação Mobile)
const pickerButtons = document.querySelectorAll('.picker-btn');
const feedbackMsg = document.getElementById('feedback-msg');
const pickerBtnText = document.getElementById('picker-btn-text');
const pickerWhatsappBtn = document.getElementById('picker-whatsapp-btn');

const pickerResponses = {
  'Vídeos na Cama': {
    reply: '"Adorei sua escolha! Me chama no WhatsApp que eu já te mando essa opção:"',
    cta: 'Liberar Vídeos na Cama no WhatsApp 💬',
    encodedText: 'Oi Carol! Vi seu site e quero ver seus Vídeos na Cama sem cortes agora 💦'
  },
  'Chamada de Vídeo 1x1': {
    reply: '"Amo chamada ao vivo! Me chama no WhatsApp pra gente combinar nosso horário agora:"',
    cta: 'Agendar Chamada 1x1 no WhatsApp 📹',
    encodedText: 'Oi Carol! Quero agendar uma Chamada de Vídeo 1x1 com você ao vivo 📹'
  },
  'Áudio com Meu Nome': {
    reply: '"Vou gemer seu nome bem baixinho... Me manda seu nome no WhatsApp:"',
    cta: 'Pedir Áudio com Meu Nome no WhatsApp 🎙️',
    encodedText: 'Oi Carol! Quero um áudio íntimo com meu nome gravado pra mim 🎙️'
  }
};

pickerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    pickerButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-checked', 'true');

    const opt = btn.dataset.option;
    const config = pickerResponses[opt] || pickerResponses['Vídeos na Cama'];

    if (feedbackMsg) feedbackMsg.textContent = config.reply;
    if (pickerBtnText) pickerBtnText.textContent = config.cta;
    if (pickerWhatsappBtn) {
      pickerWhatsappBtn.href = `https://wa.me/message/AYCUNLYYIOSZO1?text=${encodeURIComponent(config.encodedText)}`;
    }

    emit('lead_preference_selected', {option: opt});
  });
});

// Voice Note Teaser (iMessage Audio Player Mockup)
const voiceCard = document.getElementById('voice-teaser');
const voicePlayBtn = document.getElementById('voice-play-btn');
const voiceTime = voiceCard?.querySelector('.voice-time');
let voicePlaying = false;
let voiceCountdown = 18;
let voiceTimer = null;

if (voicePlayBtn && voiceCard) {
  voicePlayBtn.addEventListener('click', () => {
    voicePlaying = !voicePlaying;
    if (voicePlaying) {
      voiceCard.classList.add('is-active');
      voicePlayBtn.querySelector('.voice-btn-icon').textContent = '❚❚';
      emit('voice_teaser_play');
      clearInterval(voiceTimer);
      voiceTimer = setInterval(() => {
        voiceCountdown--;
        if (voiceTime) {
          voiceTime.textContent = `0:${voiceCountdown < 10 ? '0' : ''}${voiceCountdown}`;
        }
        if (voiceCountdown <= 0) {
          clearInterval(voiceTimer);
          voicePlaying = false;
          voiceCard.classList.remove('is-active');
          voicePlayBtn.querySelector('.voice-btn-icon').textContent = '▶';
          voiceCountdown = 18;
          if (voiceTime) voiceTime.textContent = '0:18';
          // Prompt user to listen rest on WhatsApp
          window.open('https://wa.me/message/AYCUNLYYIOSZO1', '_blank', 'noopener');
        }
      }, 1000);
    } else {
      voiceCard.classList.remove('is-active');
      voicePlayBtn.querySelector('.voice-btn-icon').textContent = '▶';
      clearInterval(voiceTimer);
    }
  });
}

// Smart Live Activity Toasts (Google / Stripe Style Social Proof)
const liveToast = document.getElementById('live-toast');
const toastTitle = document.getElementById('toast-title');
const toastText = document.getElementById('toast-text');
const toastTime = document.getElementById('toast-time');
const toastClose = document.getElementById('toast-close');

const socialProofs = [
  {name: 'Pedro S. (Belo Horizonte)', action: 'Acabou de liberar o VIP no WhatsApp', time: 'há 2 min'},
  {name: 'Lucas M. (São Paulo)', action: 'Agendou Chamada de Vídeo 1x1', time: 'há 4 min'},
  {name: 'Rodrigo C. (Rio de Janeiro)', action: 'Liberou o Acesso VIP Completo', time: 'há 7 min'},
  {name: 'Matheus F. (Curitiba)', action: 'Pediu áudio exclusivo com seu nome', time: 'há 11 min'},
  {name: 'Guilherme T. (Campinas)', action: 'Acabou de entrar no atendimento 1x1', time: 'há 14 min'}
];
let toastIndex = 0;
let toastTimeout = null;

function showNextToast() {
  if (!liveToast || document.hidden) return;
  const item = socialProofs[toastIndex % socialProofs.length];
  toastIndex++;
  if (toastTitle) toastTitle.textContent = item.name;
  if (toastText) toastText.textContent = item.action;
  if (toastTime) toastTime.textContent = `${item.time} · ⚡ Verificado`;
  
  liveToast.hidden = false;
  liveToast.classList.remove('toast-hiding');
  emit('live_toast_shown', {lead: item.name});

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    liveToast.classList.add('toast-hiding');
    setTimeout(() => { liveToast.hidden = true; }, 400);
  }, 6000);
}

if (liveToast) {
  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 22000);
  }, 4000);

  if (toastClose) {
    toastClose.addEventListener('click', e => {
      e.stopPropagation();
      liveToast.classList.add('toast-hiding');
      setTimeout(() => { liveToast.hidden = true; }, 400);
    });
  }

  liveToast.addEventListener('click', () => {
    emit('live_toast_clicked');
    window.open('https://wa.me/message/AYCUNLYYIOSZO1', '_blank', 'noopener');
  });
}

// Smart Retention Sheet (Apple Glass Modal)
const smartExitDialog = document.getElementById('smart-exit-dialog');
let userEngaged = false;
let exitShown = false;
const arrivedAt = Date.now();

try {
  exitShown = sessionStorage.getItem('smart_exit_shown') === '1';
} catch {}

function openSmartExit(reason = 'exit_intent') {
  if (exitShown || userEngaged || smartExitDialog?.open) return;
  exitShown = true;
  try {
    sessionStorage.setItem('smart_exit_shown', '1');
  } catch {}
  pauseAllVideos();
  smartExitDialog?.showModal();
  emit('smart_retention_viewed', {reason});
}

// Exit-intent detection for desktop (mouse leaving top of screen)
document.addEventListener('mouseleave', e => {
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && e.clientY <= 0 && Date.now() - arrivedAt > 15000) {
    openSmartExit('desktop_top_exit');
  }
});

// Mobile exit / inactivity trigger (scrolled whole page after 25s)
let maxScrollPercent = 0;
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (total > 0) {
    const current = (window.scrollY / total) * 100;
    if (current > maxScrollPercent) maxScrollPercent = current;
    if (maxScrollPercent > 70 && Date.now() - arrivedAt > 28000) {
      openSmartExit('scroll_depth_idle');
    }
  }
}, {passive: true});

// Close buttons for modals
document.querySelectorAll('[data-close]').forEach(b => {
  b.addEventListener('click', () => {
    const target = document.getElementById(b.dataset.close);
    target?.close();
  });
});

document.getElementById('modal-decline')?.addEventListener('click', () => {
  smartExitDialog?.close();
});

if (smartExitDialog) {
  smartExitDialog.addEventListener('click', e => {
    if (e.target === smartExitDialog) {
      const r = smartExitDialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        smartExitDialog.close();
      }
    }
  });
}

// Tracking & direct redirection on all WhatsApp links
document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
  a.addEventListener('click', () => {
    userEngaged = true;
    emit('whatsapp_clicked', {href: a.href});
  });
});

// Mobile Dock Bar (iOS Tab Bar) visibility on scroll
const mobileDock = document.getElementById('mobile-dock');
if (mobileDock) {
  window.addEventListener('scroll', () => {
    mobileDock.classList.toggle('is-visible', window.scrollY > 300);
  }, {passive: true});
}

// Title phrase transitions
let phraseStarted = false;
function startPhrases() {
  if (phraseStarted || reduced) return;
  phraseStarted = true;
  const el = document.querySelector('.motion-phrase');
  if (!el) return;
  let index = 0;
  const phrases = ['No seu tempo.', 'Do seu jeito.', 'Sem censura.'];
  const change = () => {
    if (document.hidden) {
      setTimeout(change, 1500);
      return;
    }
    el.animate([
      {opacity: 1, transform: 'translateY(0)', filter: 'blur(0)'},
      {opacity: 0, transform: 'translateY(-12px)', filter: 'blur(5px)'}
    ], {duration: 350, easing: 'ease-in', fill: 'forwards'})
    .finished.then(() => {
      el.textContent = phrases[index++];
      return el.animate([
        {opacity: 0, transform: 'translateY(14px)', filter: 'blur(5px)'},
        {opacity: 1, transform: 'translateY(0)', filter: 'blur(0)'}
      ], {duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards'}).finished;
    })
    .then(() => {
      if (index < phrases.length) setTimeout(change, 4500);
    }).catch(() => {});
  };
  setTimeout(change, 4500);
}

if (level === 3) startPhrases();
else window.addEventListener('presell:intro-ready', startPhrases, {once: true});
