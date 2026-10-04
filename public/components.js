import {
  siteConfig as c,
  TELEGRAM_BOT_URL
} from './config.js';

const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    x =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[x]
  );

// Deep link principal.
// O parâmetro start=site permite identificar no bot
// que o usuário veio da pressell.
const BOT_URL = `${TELEGRAM_BOT_URL}?start=site`;

export function Hero() {
  return `
<section class="experience">

  <div class="portrait">
    <video
      id="intro-video"
      muted
      playsinline
      webkit-playsinline
      preload="metadata"
      poster="${esc(c.heroImage)}"
      aria-label="Vídeo de apresentação da Carolina Satler, sem áudio"
    >
      <source
        src="${esc(c.heroVideo)}"
        type="video/mp4"
      >
    </video>
  </div>

  <button
    id="intro-play"
    class="intro-play"
    type="button"
    aria-label="Reproduzir vídeo de apresentação"
    hidden
  >
    <span aria-hidden="true">▶</span>
    <span>Toque para ver</span>
  </button>

  <header class="stage stage-1">

    <span class="wordmark">
      Carolzinha
      <small>privé</small>
    </span>

    <a
      href="/entrar"
      class="existing-access"
    >
      Já tenho acesso ↗
    </a>

  </header>

  <div class="conversation">

    <div class="stage stage-1">

      <span class="eyebrow">
        CHEGA MAIS…
      </span>

      <h1>
        ${esc(c.headline)}

        <em
          class="motion-phrase"
          aria-hidden="true"
        >
          ${esc(c.headlineEmphasis)}
        </em>

        <span class="sr-only">
          Sem censura. No seu tempo. Do seu jeito.
        </span>
      </h1>

    </div>

    <div class="stage stage-2">

      <p class="description">
        ${esc(c.description)}
      </p>

    </div>

    <div
      class="stage stage-3"
      id="action"
    >

      <a
        class="contact bot-primary"
        data-main-bot
        href="${BOT_URL}"
        target="_top"
        rel="noopener"
      >
        <span>
          ${esc(c.cta)}
        </span>

        <span
          class="arrow"
          aria-hidden="true"
        >
          ↗
        </span>
      </a>

      <a
        class="preview-skip"
        href="#previas"
      >
        Quero ver umas prévias primeiro ↓
      </a>

      <p class="disclosure">
        ${esc(c.disclosure)}
      </p>

    </div>

  </div>

</section>


<section
  class="short-gallery"
  id="previas"
  aria-labelledby="gallery-title"
>

  <span class="eyebrow">
    UM POUCO MAIS DE MIM
  </span>

  <h2 id="gallery-title">
    Você viu só o começo.
  </h2>

  <p>
    Separei alguns momentos por aqui...
    o restante eu deixei guardado. 👀🔥
  </p>

  <div
    class="media-strip"
    aria-label="Galeria de prévias"
  >

    <figure>

      <video controls muted playsinline preload="metadata" aria-label="Primeira prévia"><source src="/assets/video-2.mp4" type="video/mp4"></video>

      <figcaption>
        Uma das prévias
      </figcaption>

    </figure>


    <figure class="short-video-frame">

      <video
        id="extra-video"
        muted
        playsinline
        preload="none"

        aria-label="Segunda prévia de apresentação"
      >

        <source
          src="/assets/belovedprestigioussandbarshark.mp4"
          type="video/mp4"
        >

      </video>

      <button
        id="extra-play"
        aria-label="Reproduzir segunda prévia"
      >
        ▶ Ver prévia
      </button>

      <figcaption>
        Mais uma prévia
      </figcaption>

    </figure>


    <figure>

      <video controls muted playsinline preload="metadata" aria-label="Terceira prévia"><source src="/assets/trickyturbulentbrahmancow.mp4" type="video/mp4"></video>

      <figcaption>
        Só mais um pouco 👀
      </figcaption>

    </figure>

  </div>


  <a
    href="${BOT_URL}"
    class="gallery-next"
    target="_top"
    rel="noopener"
  >
    Quero continuar com a Carol ↗
  </a>

</section>


<section
  class="short-offers portal-section"
  id="acessos"
  aria-labelledby="offers-title"
>

  <div class="portal-copy">

    <span class="eyebrow">
      O MELHOR ESTÁ GUARDADO…
    </span>

    <h2 id="offers-title">
      Tem coisas que eu não
      <br>
      <em>deixo abertas por aqui.</em>
    </h2>

    <p>
      Se você chegou até aqui,
      provavelmente já ficou curioso.
      No privado eu te mostro o restante. 😈✨
    </p>

  </div>


  <div
    class="invitation-card"
    id="convite"
  >

    <span
      class="invitation-monogram"
      aria-hidden="true"
    >
      C
    </span>

    <span class="eyebrow">
      CAROLZINHA / PRIVÉ
    </span>

    <h3>
      Meu cantinho privado.
      <br>
      Mais perto de mim.
    </h3>

    <p>
      Entra no meu bot,
      vê as prévias e escolhe por lá
      como quer liberar seu acesso.
    </p>

    <a
      class="contact bot-primary"
      data-main-bot
      href="${BOT_URL}"
      target="_top"
      rel="noopener"
    >
      Conversar comigo agora

      <span
        class="arrow"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>

    <p class="disclosure">
      Conteúdo +18 · Acesso privado pelo Telegram
    </p>

  </div>


  <a
    class="starter-choice"
    id="short-starter"
    href="${BOT_URL}"
    target="_top"
    rel="noopener"
  >
    Quero ver mais primeiro 👀 →
  </a>

</section>


<footer class="short-footer">

  <span>
    Carolzinha Privé · 18+
  </span>

  <a href="/entrar">
    Área de membros ↗
  </a>

</footer>


<dialog
  id="primary-dialog"
  class="invite-dialog"
  aria-labelledby="primary-title"
>

  <button
    class="short-close"
    data-close="primary-dialog"
    aria-label="Fechar convite"
  >
    ×
  </button>

  <span
    class="dialog-emblem"
    aria-hidden="true"
  >
    ↗
  </span>

  <span class="eyebrow">
    VEM MAIS PRA PERTO
  </span>

  <h2 id="primary-title">
    Ainda ficou
    <br>
    curioso? 👀
  </h2>

  <p>
    Eu deixei mais algumas coisas separadas.
    Vem falar comigo e eu te mostro como funciona
    o acesso privado.
  </p>

  <a
    class="contact"
    href="${BOT_URL}"
    target="_top"
    rel="noopener"
  >
    Continuar comigo no Telegram ↗
  </a>

  <p class="disclosure">
    Conteúdo exclusivo para maiores de 18 anos.
  </p>

  <button
    class="starter-choice"
    data-close="primary-dialog"
  >
    Continuar vendo as prévias
  </button>

</dialog>


<dialog
  id="short-dialog"
  class="invite-dialog"
  aria-labelledby="short-dialog-title"
>

  <button
    class="short-close"
    data-close="short-dialog"
    aria-label="Fechar convite"
  >
    ×
  </button>

  <span
    class="dialog-emblem"
    aria-hidden="true"
  >
    ◇
  </span>

  <span class="eyebrow">
    ANTES DE IR…
  </span>

  <h2 id="short-dialog-title">
    Quer ver
    <br>
    mais uma coisa? 👀
  </h2>

  <p>
    Eu deixei as próximas prévias dentro da conversa comigo.
    É só entrar e continuar de onde parou.
  </p>

  <a
    id="short-bot"
    class="contact"
    href="${BOT_URL}"
    target="_top"
    rel="noopener"
  >
    Continuar com a Carol ↗
  </a>

  <!--
    Mantemos este ID porque o app.js atual pode procurá-lo.
    Ele fica oculto para preservar compatibilidade sem criar
    botão duplicado.
  -->
  <button
    id="short-bot-pending"
    class="contact"
    hidden
    disabled
  >
    Carregando…
  </button>

  <p class="disclosure">
    Você continua diretamente pelo meu bot.
  </p>

  <button
    class="starter-choice"
    id="short-decline"
  >
    Agora não, continuar na página
  </button>

</dialog>
`;
}