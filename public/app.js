import { setupIntro } from './intro-player.js';

import {
  siteConfig,
  TELEGRAM_BOT_URL
} from './config.js';

import { Hero } from './components.js';

import {
  sessionAttribution,
  captureAttribution,
  trackPageView,
  trackChatOpened
} from './tracking.js';

import { track } from './analytics.js';

// ======================================================
// DESTINO PRINCIPAL (COM PRESERVAÇÃO DE PARÂMETROS)
// ======================================================

function getTelegramUrl() {
  try {
    const params = new URLSearchParams(location.search);
    const src = params.get('utm_source') || params.get('ref') || 'site';
    return `${TELEGRAM_BOT_URL}?start=${encodeURIComponent(src)}`;
  } catch {
    return `${TELEGRAM_BOT_URL}?start=site`;
  }
}

const BOT_URL = getTelegramUrl();


// ======================================================
// ATTRIBUTION / ANALYTICS
// ======================================================

let attribution;

try {
  attribution = sessionAttribution(
    location.search,
    sessionStorage
  );
} catch {
  attribution = captureAttribution(location.search);
}

const emit = (event, extra = {}) =>
  track(event, {
    ...attribution,
    ...extra
  });

// Dispara Evento 1: PageView + PresellView { page: 'presell' }
trackPageView();


// ======================================================
// RENDER PRINCIPAL
// ======================================================

document.getElementById('app').innerHTML = Hero();

document.title =
  `${siteConfig.creatorName} — Convite Privé`;

// ======================================================
// BOTÃO FLUTUANTE DE ACESSO DIRETO AO TELEGRAM
// ======================================================

const floatingChat = document.createElement('a');
floatingChat.href = BOT_URL;
floatingChat.target = '_blank';
floatingChat.rel = 'noopener';
floatingChat.className = 'tg-floating-trigger';
floatingChat.innerHTML = `
  <div class="tg-floating-avatar-wrap">
    <img src="/assets/carol-avatar.jpg" alt="Carolzinha" class="tg-floating-avatar" />
    <span class="tg-status-dot"></span>
  </div>
  <div class="tg-floating-label">
    <strong>Carolzinha Satler</strong>
    <small>online no Telegram • me chama 🔥</small>
  </div>
`;
floatingChat.addEventListener('click', () => {
  trackChatOpened('floating_btn');
  emit('telegram_chat_opened', { source: 'floating_btn', destination: 'telegram_bot' });
});
document.body.appendChild(floatingChat);


// ======================================================
// ELEMENTOS PRINCIPAIS
// ======================================================

const video =
  document.getElementById('intro-video');

const surface =
  document.querySelector('.experience');

const stages = [
  ...document.querySelectorAll('.stage')
];

const reduced =
  matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

let level = 0;


// ======================================================
// FUNIL VISUAL DA INTRO
// ======================================================

stages.forEach(el => {
  el.inert = true;
  el.setAttribute(
    'aria-hidden',
    'true'
  );
});


function reveal(next, reason) {

  if (next <= level) return;

  level = next;

  surface.dataset.stage =
    String(next);

  stages.forEach(el => {

    const rank =
      el.classList.contains('stage-3')
        ? 3
        : el.classList.contains('stage-2')
          ? 2
          : 1;

    if (rank <= next) {

      el.classList.add('visible');

      el.inert = false;

      el.removeAttribute(
        'aria-hidden'
      );

    }

  });


  if (next === 3) {

    emit(
      'offer_view',
      { reason }
    );

    window.dispatchEvent(
      new Event(
        'presell:intro-ready'
      )
    );

  }

}

// Desbloqueia o funil da landing page imediatamente no carregamento
reveal(3, 'direct');


// ======================================================
// EVENTOS GERAIS
// ======================================================

document
  .querySelector('.contact')
  ?.addEventListener(
    'click',
    () =>
      emit(
        'offers_navigation'
      )
  );


emit('presell_view');


// ======================================================
// VÍDEO PRINCIPAL
// ======================================================

setupIntro(
  video,
  document.getElementById(
    'intro-play'
  ),
  {
    reveal,

    manual:
      reduced ||
      !!navigator.connection
        ?.saveData
  }
);


// ======================================================
// VÍDEO EXTRA / PRÉVIA
// ======================================================

// ======================================================
// VÍDEOS EM LOOP CONTÍNUO (INTRO E PRÉVIAS)
// ======================================================

const extra = document.getElementById('extra-video');
if (extra) {
  extra.muted = true;
  extra.defaultMuted = true;
  extra.loop = true;
  extra.playsInline = true;
  extra.play().catch(() => {});
  extra.addEventListener('pause', () => {
    extra.play().catch(() => {});
  });
  extra.addEventListener('ended', () => {
    extra.currentTime = 0;
    extra.play().catch(() => {});
  });
}

// Força todos os vídeos da página a rodarem em loop contínuo sem travar
function enforceVideoLoops() {
  document.querySelectorAll('video').forEach(v => {
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    if (v.paused) {
      v.play().catch(() => {});
    }
  });
}
enforceVideoLoops();
setInterval(enforceVideoLoops, 2500);





// ======================================================
// PAUSAR MÍDIA AO SAIR DA ABA
// ======================================================

document.addEventListener(
  'visibilitychange',
  () => {

    if (
      document.hidden
    ) {

      extra?.pause();

      video?.pause();

    }

  }
);


// ======================================================
// DIALOG SECUNDÁRIO
// ======================================================

const dialog =
  document.getElementById(
    'short-dialog'
  );


const shortBot =
  document.getElementById(
    'short-bot'
  );


if (shortBot) {

  shortBot.href =
    BOT_URL;

  shortBot.target =
    '_top';

  shortBot.hidden =
    false;

}


const shortPending =
  document.getElementById(
    'short-bot-pending'
  );


if (shortPending) {

  shortPending.hidden =
    true;

}


let clicked =
  false;

let seen =
  false;

let shown =
  false;

const arrived =
  Date.now();


try {

  shown =
    sessionStorage.getItem(
      'short_starter_shown'
    ) === '1';

} catch {}


// ======================================================
// MODAL DE RETENÇÃO
// ======================================================

function openStarter(
  explicit = false
) {

  const primary =
    document.getElementById(
      'primary-dialog'
    );


  if (
    !dialog ||
    dialog.open ||
    primary?.open ||
    (
      !explicit &&
      (
        shown ||
        clicked
      )
    )
  ) {
    return;
  }


  shown = true;


  try {

    sessionStorage.setItem(
      'short_starter_shown',
      '1'
    );

  } catch {}


  extra?.pause();

  video?.pause();


  dialog.showModal();


  emit(
    'starter_offer_viewed',
    {
      reason:
        explicit
          ? 'choice'
          : 'desktop_exit_signal'
    }
  );

}


// ======================================================
// CTA SECUNDÁRIO
// ======================================================

const shortStarter =
  document.getElementById(
    'short-starter'
  );


if (shortStarter) {

  /*
   * Agora esse elemento já aponta
   * diretamente para o bot.
   *
   * Portanto não interceptamos
   * para abrir canal/modal antigo.
   */

  shortStarter.href =
    BOT_URL;

  shortStarter.target =
    '_top';


  shortStarter.addEventListener(
    'click',
    () => {

      clicked = true;

      emit(
        'telegram_bot_clicked',
        {
          source:
            'starter_choice'
        }
      );

    }
  );

}


// ======================================================
// BOTÕES DE FECHAR MODAL
// ======================================================

document
  .querySelectorAll(
    '[data-close]'
  )
  .forEach(button => {

    button.onclick = () => {

      document
        .getElementById(
          button.dataset.close
        )
        ?.close();

    };

  });


document
  .getElementById(
    'short-decline'
  )
  ?.addEventListener(
    'click',
    () =>
      dialog?.close()
  );


// ======================================================
// CLIQUE FORA DO MODAL
// ======================================================

dialog?.addEventListener(
  'click',
  event => {

    if (
      event.target !== dialog
    ) {
      return;
    }


    const rect =
      dialog
        .getBoundingClientRect();


    if (
      event.clientX <
        rect.left ||
      event.clientX >
        rect.right ||
      event.clientY <
        rect.top ||
      event.clientY >
        rect.bottom
    ) {

      dialog.close();

    }

  }
);


// ======================================================
// VISUALIZAÇÃO DA ÁREA DE ACESSO
// ======================================================

if (
  'IntersectionObserver'
  in window
) {

  const accessSection =
    document.getElementById(
      'acessos'
    );


  if (accessSection) {

    const offersObserver =
      new IntersectionObserver(
        entries => {

          if (
            entries.some(
              entry =>
                entry.isIntersecting
            )
          ) {

            seen = true;

            emit(
              'main_offers_viewed'
            );

            offersObserver
              .disconnect();

          }

        },
        {
          threshold: 0.3
        }
      );


    offersObserver.observe(
      accessSection
    );

  }

}


// ======================================================
// EXIT INTENT DESKTOP
// ======================================================

document.addEventListener(
  'mouseleave',
  event => {

    if (
      matchMedia(
        '(hover:hover) and (pointer:fine)'
      ).matches &&
      event.clientY <= 0 &&
      seen &&
      Date.now() -
        arrived >
        20000
    ) {

      openStarter();

    }

  }
);


// ======================================================
// DESTINO DO BOT PRINCIPAL
// ======================================================

const primaryDialog =
  document.getElementById(
    'primary-dialog'
  );


document
  .querySelectorAll(
    '[data-main-bot], a[href*="t.me"], .contact, .gallery-next, .starter-choice'
  )
  .forEach(link => {
    link.href = BOT_URL;
    link.target = '_blank';
    link.rel = 'noopener';

    link.addEventListener('click', () => {
      clicked = true;
      emit('telegram_chat_opened', {
        source: 'cta_click',
        destination: 'telegram_bot',
        href: link.href
      });
      trackChatOpened('main_cta');
    });
  });


// ======================================================
// MODAL PRINCIPAL
// ======================================================

primaryDialog
  ?.addEventListener(
    'click',
    event => {

      if (
        event.target !==
        primaryDialog
      ) {
        return;
      }


      const rect =
        primaryDialog
          .getBoundingClientRect();


      if (
        event.clientX <
          rect.left ||
        event.clientX >
          rect.right ||
        event.clientY <
          rect.top ||
        event.clientY >
          rect.bottom
      ) {

        primaryDialog.close();

      }

    }
  );


// ======================================================
// FRASES DINÂMICAS
// ======================================================

let phraseStarted =
  false;


function startPhrases() {

  if (
    phraseStarted ||
    reduced
  ) {
    return;
  }


  phraseStarted =
    true;


  const el =
    document.querySelector(
      '.motion-phrase'
    );


  if (!el) return;


  let index = 0;


  const phrases = [
    'Mais perto.',
    'Só entre nós.'
  ];


  const change = () => {

    if (
      document.hidden
    ) {

      setTimeout(
        change,
        1500
      );

      return;

    }


    el.animate(
      [
        {
          opacity: 1,
          transform:
            'translateY(0)',
          filter:
            'blur(0)'
        },
        {
          opacity: 0,
          transform:
            'translateY(-12px)',
          filter:
            'blur(5px)'
        }
      ],
      {
        duration: 350,
        easing:
          'ease-in',
        fill:
          'forwards'
      }
    )
      .finished
      .then(() => {

        el.textContent =
          phrases[index++];


        return el.animate(
          [
            {
              opacity: 0,
              transform:
                'translateY(14px)',
              filter:
                'blur(5px)'
            },
            {
              opacity: 1,
              transform:
                'translateY(0)',
              filter:
                'blur(0)'
            }
          ],
          {
            duration: 600,
            easing:
              'cubic-bezier(.2,.8,.2,1)',
            fill:
              'forwards'
          }
        ).finished;

      })
      .then(() => {

        if (
          index <
          phrases.length
        ) {

          setTimeout(
            change,
            4800
          );

        }

      })
      .catch(
        () => {}
      );

  };


  setTimeout(
    change,
    4800
  );

}


// ======================================================
// INICIAR FRASES
// ======================================================

if (
  level === 3
) {

  startPhrases();

} else {

  window.addEventListener(
    'presell:intro-ready',
    startPhrases,
    {
      once: true
    }
  );

}


// ======================================================
// ANIMAÇÃO DE ENTRADA DAS SEÇÕES
// ======================================================

const revealNodes =
  document.querySelectorAll(
    '.short-gallery, .portal-copy, .invitation-card'
  );


if (
  !reduced &&
  'IntersectionObserver'
  in window
) {

  const motionObserver =
    new IntersectionObserver(
      entries =>
        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList
                .add(
                  'motion-entered'
                );


              motionObserver
                .unobserve(
                  entry.target
                );

            }

          }
        ),
      {
        threshold: 0.12
      }
    );


  revealNodes.forEach(
    element => {

      element
        .classList
        .add(
          'motion-pending'
        );


      motionObserver
        .observe(
          element
        );

    }
  );

}


// ======================================================
// CONTROLES DA GALERIA
// ======================================================

const strip =
  document.querySelector(
    '.media-strip'
  );


if (strip) {

  const figures = [
    ...strip.children
  ];


  const galleryControls =
    document.createElement(
      'div'
    );


  galleryControls.className =
    'gallery-controls';


  galleryControls
    .setAttribute(
      'aria-label',
      'Navegar pelas prévias'
    );


  figures.forEach(
    (figure, index) => {

      const button =
        document.createElement(
          'button'
        );


      button.setAttribute(
        'aria-label',
        `Ver prévia ${index + 1}`
      );


      button.textContent =
        String(index + 1)
          .padStart(
            2,
            '0'
          );


      button.onclick =
        () => {

          strip.scrollTo({
            left:
              figure.offsetLeft -
              strip
                .firstElementChild
                .offsetLeft,

            behavior:
              reduced
                ? 'auto'
                : 'smooth'
          });


          emit(
            'preview_gallery_navigated',
            {
              preview:
                index + 1
            }
          );

        };


      galleryControls.append(
        button
      );

    }
  );


  strip.after(
    galleryControls
  );

}