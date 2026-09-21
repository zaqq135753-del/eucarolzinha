import {siteConfig as c} from './config.js';
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

export function Hero(){
  return `<section class="experience">
  <div class="portrait">
    <video id="intro-video" muted playsinline webkit-playsinline preload="metadata" poster="${esc(c.heroImage)}" aria-label="Vídeo de apresentação da Carolina Satler, sem áudio">
      <source src="${esc(c.heroVideo)}" type="video/mp4">
    </video>
  </div>
  <button id="intro-play" class="intro-play" type="button" aria-label="Reproduzir vídeo de apresentação" hidden>
    <span aria-hidden="true">▶</span><span>Toque para ver</span>
  </button>
  <header class="stage stage-1">
    <div class="header-brand">
      <span class="wordmark">Carolzinha<small>privé</small></span>
      <span class="live-pill"><span class="live-dot"></span> Online no Telegram</span>
    </div>
    <a href="/entrar" class="existing-access">Já tenho acesso ↗</a>
  </header>
  <div class="conversation">
    <div class="stage stage-1">
      <span class="eyebrow">CONTEÚDO EXCLUSIVO · 18+</span>
      <h1>${esc(c.headline)} <em class="motion-phrase" aria-hidden="true">${esc(c.headlineEmphasis)}</em><span class="sr-only">Mais de perto. No seu tempo. Do seu jeito.</span></h1>
    </div>
    <div class="stage stage-2">
      <p class="description">Sem censura, sem filtros e do jeitinho que você sempre quis me ver. Fotos, vídeos me tocando e conversas íntimas direto no Telegram.</p>
      <div class="trust-tags">
        <span class="tag-item">🔒 100% Discreto</span>
        <span class="tag-item">⚡ Acesso Imediato</span>
        <span class="tag-item">🔞 Sem Censura</span>
      </div>
    </div>
    <div class="stage stage-3" id="action">
      <div class="cta-stack">
        <a class="contact bot-primary" data-main-bot href="#convite">
          <svg class="tg-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          <div class="cta-text">
            <strong>Falar com a Carol no Telegram</strong>
            <small>Acesso VIP Completo Sem Censura</small>
          </div>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a class="contact contact-secondary" href="https://t.me/+N0qDwwVScTIxNGMx" target="_blank" rel="noopener">
          <span>👀 Entrar no Canal de Prévias (Grátis)</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <a class="preview-skip" href="#previas">Ver fotos e prévias gratuitas abaixo ↓</a>
      <p class="disclosure">🔞 Conteúdo adulto exclusivo · Sigilo garantido</p>
    </div>
  </div>
</section>

<section class="short-gallery" id="previas" aria-labelledby="gallery-title">
  <span class="eyebrow">PRÉVIAS EXCLUSIVAS</span>
  <h2 id="gallery-title">Você viu só o começo.</h2>
  <p>Separei essas prévias gratuitas pra você sentir o clima. Desliza pro lado e vem ver. 😉</p>
  <div class="media-strip" aria-label="Galeria de prévias">
    <!-- Vídeo Prévia 1 -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">🔥 VÍDEO EXCLUSIVO</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata" poster="/assets/short-photo-1.webp">
        <source src="/assets/belovedprestigioussandbarshark.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>No espelho me provocando 🔥</figcaption>
    </figure>

    <!-- Vídeo Prévia 2 -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">🤤 VÍDEO ÍNTIMO</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata" poster="/assets/bonus-photo.webp">
        <source src="/assets/trickyturbulentbrahmancow.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>Deitada na cama me tocando 🤤</figcaption>
    </figure>

    <!-- Vídeo Prévia 3 -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">💦 SEM CENSURA</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata" poster="/assets/short-photo-2.webp">
        <source src="/assets/video-2.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>Sem censura no banho 💦</figcaption>
    </figure>

    <!-- Foto 1 -->
    <figure>
      <img loading="lazy" src="/assets/short-photo-1.webp" alt="Carolzinha à beira da piscina">
      <figcaption>À beira da piscina</figcaption>
    </figure>

    <!-- Foto 2 -->
    <figure>
      <img loading="lazy" src="/assets/short-photo-2.webp" alt="Carolzinha na natureza">
      <figcaption>Um instante sem roupa na natureza</figcaption>
    </figure>

    <!-- Foto 3 -->
    <figure>
      <img loading="lazy" src="/assets/bonus-photo.webp" alt="Carolzinha bastidores exclusivos">
      <figcaption>Bastidores exclusivos 🔞</figcaption>
    </figure>
  </div>
  <a href="#acessos" class="gallery-next">Escolher como quer me ver ↓</a>
</section>

<section class="short-offers portal-section" id="acessos" aria-labelledby="offers-title">
  <div class="portal-copy">
    <span class="eyebrow">SEU ACESSO DIRETO</span>
    <h2 id="offers-title">Escolha como<br><em>quer me ver.</em></h2>
    <p>Você pode espiar de graça no canal de prévias ou entrar no VIP para me ter todinha sem nenhuma censura:</p>
  </div>

  <div class="funnel-cards-grid">
    <!-- Card Grátis -->
    <div class="funnel-card free-card">
      <span class="card-badge">100% GRATUITO</span>
      <h3>Canal de Prévias</h3>
      <p class="card-sub">Para você me conhecer melhor e sentir a temperatura.</p>
      <ul class="card-checklist">
        <li>✓ Prévias semanais de fotos sensuais</li>
        <li>✓ Vídeos teasers sem censura leve</li>
        <li>✓ Avisos quando eu entrar ao vivo</li>
      </ul>
      <a class="card-action btn-outline" href="https://t.me/+N0qDwwVScTIxNGMx" target="_blank" rel="noopener">
        <span>Entrar no Canal Grátis</span>
        <span>↗</span>
      </a>
    </div>

    <!-- Card VIP -->
    <div class="funnel-card vip-card" id="convite">
      <div class="vip-glow"></div>
      <div class="vip-ribbon">🔥 MAIS DESEJADO</div>
      <span class="card-badge vip-badge">LIBERAÇÃO IMEDIATA</span>
      <h3>Acesso VIP Privé</h3>
      <p class="card-sub">Eu todinha pra você, 100% nua e sem nenhum corte.</p>
      <ul class="card-checklist">
        <li>🔥 Vídeos explícitos me tocando até gozar</li>
        <li>💦 Fotos e ensaios 100% sem censura</li>
        <li>💋 Conversa íntima direta comigo no Telegram</li>
        <li>🔒 Cobrança discreta e sigilo absoluto</li>
      </ul>
      <a class="card-action btn-vip bot-primary" data-main-bot href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
        <strong>Liberar Meu VIP Agora 🔞</strong>
      </a>
    </div>
  </div>

  <button class="starter-choice" id="short-starter">Quer ver mais uma prévia grátis? Clique aqui →</button>
</section>

<!-- Mobile Sticky Bottom Bar -->
<div class="mobile-bottom-bar" id="mobile-bottom">
  <div class="bar-profile">
    <span class="bar-avatar">
      <img src="/assets/short-photo-1.webp" alt="Carolzinha">
      <span class="dot-online"></span>
    </span>
    <div class="bar-text">
      <strong>Carolzinha Privé</strong>
      <small>Online no Telegram</small>
    </div>
  </div>
  <a class="bar-cta bot-primary" data-main-bot href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">
    Falar no Telegram 🔞
  </a>
</div>

<footer class="short-footer">
  <span>Carolzinha Privé · 18+ · Conteúdo Exclusivo</span>
  <a href="/entrar">Área de membros ↗</a>
</footer>

<!-- Diálogo de Acesso Principal (Fallback) -->
<dialog id="primary-dialog" class="invite-dialog" aria-labelledby="primary-title">
  <button class="short-close" data-close="primary-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">🔞</span>
  <span class="eyebrow">ACESSO EXCLUSIVO</span>
  <h2 id="primary-title">Vem direto<br>pro meu Telegram.</h2>
  <p>Lá no meu bot privado eu libero seu acesso VIP imediato com todos os meus vídeos sem censura.</p>
  <a class="contact bot-primary" href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">
    Abrir conversa no Telegram ↗
  </a>
</dialog>

<!-- Diálogo de Retenção / Saída -->
<dialog id="short-dialog" class="invite-dialog" aria-labelledby="short-dialog-title">
  <button class="short-close" data-close="short-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">😈</span>
  <span class="eyebrow">ESPERA UM SEGUNDO…</span>
  <h2 id="short-dialog-title">Não vai embora<br>sem me espiar... 😉</h2>
  <p>Eu criei um <b>canal 100% gratuito no Telegram</b> pra quem quer ver algumas prévias antes de decidir. Entra lá agora:</p>
  <a id="short-bot" class="contact bot-primary" href="https://t.me/+N0qDwwVScTIxNGMx" target="_blank" rel="noopener">
    👀 Entrar nas Prévias Gratuitas ↗
  </a>
  <button id="short-bot-pending" class="contact" disabled hidden>Carregando convite...</button>
  <button class="starter-choice" id="short-decline">Continuar vendo a página</button>
</dialog>`;
}
