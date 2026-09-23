import {siteConfig as c} from './config.js';
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

export function Hero(){
  return `<section class="experience">
  <div class="portrait">
    <video id="intro-video" muted loop playsinline webkit-playsinline autoplay preload="auto" aria-label="Vídeo de apresentação da Carolina Satler, sem áudio">
      <source src="${esc(c.heroVideo)}#t=0.4" type="video/mp4">
    </video>
  </div>
  <button id="intro-play" class="intro-play" type="button" aria-label="Reproduzir vídeo de apresentação" hidden>
    <span aria-hidden="true">▶</span><span>Toque para ver</span>
  </button>
  <header class="stage stage-1">
    <div class="header-brand">
      <span class="wordmark">Carolzinha<small>privé</small></span>
      <span class="live-pill"><span class="live-dot"></span> Online no WhatsApp agora</span>
    </div>
    <a href="/entrar" class="existing-access">Já tenho acesso ↗</a>
  </header>
  <div class="conversation">
    <div class="stage stage-1">
      <span class="eyebrow">CONTEÚDO EXCLUSIVO · 18+</span>
      <h1>${esc(c.headline)} <em class="motion-phrase" aria-hidden="true">${esc(c.headlineEmphasis)}</em><span class="sr-only">Mais de perto. No seu tempo. Do seu jeito.</span></h1>
    </div>
    <div class="stage stage-2">
      <p class="description">Sem censura, sem filtros e do jeitinho que você sempre quis me ver. Me chama no WhatsApp para conversarmos no 1x1, pedir chamadas ao vivo e conteúdos personalizados, ou entre no meu canal VIP do Telegram.</p>
      <div class="trust-tags">
        <span class="tag-item">🔒 100% Discreto</span>
        <span class="tag-item">💬 Atendimento Direto 1x1</span>
        <span class="tag-item">🔞 Sem Censura</span>
      </div>
    </div>
    <div class="stage stage-3" id="action">
      <div class="cta-stack">
        <a class="contact btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
          <svg class="wp-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <div class="cta-text">
            <strong>Falar com a Carol no WhatsApp</strong>
            <small>Packs, chamadas de vídeo e conversas íntimas 1x1 💬</small>
          </div>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a class="contact contact-secondary" href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">
          <svg class="tg-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <div class="cta-text">
            <strong>Entrar no Canal VIP no Telegram</strong>
            <small>Vídeos explícitos sem cortes e sem censura 🔞</small>
          </div>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <a class="preview-skip" href="#previas">Ver prévias gratuitas abaixo ↓</a>
      <p class="disclosure">🔞 Conteúdo adulto exclusivo · Sigilo garantido</p>
    </div>
  </div>
</section>

<section class="short-gallery" id="previas" aria-labelledby="gallery-title">
  <span class="eyebrow">PRÉVIAS EXCLUSIVAS</span>
  <h2 id="gallery-title">Você viu só o começo.</h2>
  <p>Separei essas prévias em vídeo pra você sentir o clima do que te espera. Dá o play e vem ver. 😉</p>
  <div class="media-strip" aria-label="Galeria de prévias">
    <!-- Vídeo Prévia 1: Na Intimidade -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">💦 SEM CENSURA</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
        <source src="/assets/video-2.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>Na intimidade sem filtro 💦</figcaption>
    </figure>

    <!-- Vídeo Prévia 2: No Espelho -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">🔥 VÍDEO NO ESPELHO</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
        <source src="/assets/belovedprestigioussandbarshark.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>No espelho me provocando 🔥</figcaption>
    </figure>

    <!-- Vídeo Prévia 3: Na Cama -->
    <figure class="short-video-frame" data-video-card>
      <span class="video-badge">🤤 VÍDEO NA CAMA</span>
      <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
        <source src="/assets/trickyturbulentbrahmancow.mp4" type="video/mp4">
      </video>
      <button class="gallery-play-btn" aria-label="Reproduzir vídeo">
        <span class="play-icon">▶</span>
        <span class="play-label">Assistir prévia</span>
      </button>
      <figcaption>Deitada na cama me tocando 🤤</figcaption>
    </figure>
  </div>
  <a href="#acessos" class="gallery-next">Escolher como quer me ver ↓</a>
</section>

<section class="short-offers portal-section" id="acessos" aria-labelledby="offers-title">
  <div class="portal-copy">
    <span class="eyebrow">SEU ACESSO DIRETO</span>
    <h2 id="offers-title">Escolha como<br><em>quer me ver.</em></h2>
    <p>Você pode conversar diretamente comigo no WhatsApp para combinar chamada ou pack exclusivo, ou entrar no canal VIP no Telegram:</p>
  </div>

  <div class="funnel-cards-grid">
    <!-- Card WhatsApp 1x1 -->
    <div class="funnel-card whatsapp-card" id="whatsapp-privado">
      <div class="whatsapp-ribbon">🔥 CONVERSA 1X1</div>
      <span class="card-badge whatsapp-badge">🟢 ONLINE AGORA</span>
      <h3>Atendimento no WhatsApp</h3>
      <p class="card-sub">Conversa íntima e direta comigo. Sem intermediários nem enrolação.</p>
      <ul class="card-checklist">
        <li>💬 Fale diretamente comigo agora no 1x1</li>
        <li>📹 Chamadas de vídeo ao vivo (15 ou 30 min)</li>
        <li>📸 Packs de fotos e vídeos exclusivos no sigilo</li>
        <li>🎙️ Áudios personalizados me tocando e gemendo seu nome</li>
      </ul>
      <a class="card-action btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
        <svg class="wp-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <strong>Chamar a Carol no WhatsApp 💋</strong>
      </a>
    </div>

    <!-- Card VIP Telegram -->
    <div class="funnel-card vip-card" id="convite">
      <div class="vip-glow"></div>
      <div class="vip-ribbon">🔞 SEM CENSURA</div>
      <span class="card-badge vip-badge">LIBERAÇÃO IMEDIATA</span>
      <h3>Canal VIP no Telegram</h3>
      <p class="card-sub">Meu acervo completo com todos os vídeos explícitos sem cortes e atualizações frequentes.</p>
      <ul class="card-checklist">
        <li>🔥 Vídeos explícitos me tocando até gozar</li>
        <li>💦 Fotos e ensaios 100% sem censura</li>
        <li>⚡ Acesso liberado na hora no Telegram</li>
        <li>🔒 Cobrança discreta e sigilo absoluto</li>
      </ul>
      <a class="card-action btn-vip" href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">
        <svg class="tg-svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
        <strong>Acessar Canal VIP no Telegram 🔞</strong>
      </a>
    </div>
  </div>

  <div class="free-preview-box">
    <span>👀 Quer espiar algumas prévias antes de decidir?</span>
    <a href="https://t.me/+N0qDwwVScTIxNGMx" target="_blank" rel="noopener">Entrar no Canal de Prévias Gratuitas no Telegram →</a>
  </div>
</section>

<!-- Mobile Sticky Bottom Bar -->
<div class="mobile-bottom-bar" id="mobile-bottom">
  <div class="bar-profile">
    <span class="bar-avatar">
      <span class="avatar-badge">💋</span>
      <span class="dot-online"></span>
    </span>
    <div class="bar-text">
      <strong>Carolzinha</strong>
      <small>Online no WhatsApp agora</small>
    </div>
  </div>
  <a class="bar-cta btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
    Chamar no WhatsApp 💬
  </a>
</div>

<footer class="short-footer">
  <span>Carolzinha Privé · 18+ · Conteúdo Exclusivo</span>
  <a href="/entrar">Área de membros ↗</a>
</footer>

<!-- Diálogo de Acesso Principal (Fallback) -->
<dialog id="primary-dialog" class="invite-dialog" aria-labelledby="primary-title">
  <button class="short-close" data-close="primary-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">💋</span>
  <span class="eyebrow">ACESSO EXCLUSIVO</span>
  <h2 id="primary-title">Vem falar comigo<br>no WhatsApp.</h2>
  <p>Estou online agora! Me chama no WhatsApp para conversarmos no 1x1, liberar packs exclusivos ou agendar nossa chamada de vídeo.</p>
  <a class="contact btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
    Chamar no WhatsApp agora 💬
  </a>
  <a class="preview-skip" href="https://t.me/eucarolzinha_bot?start=presell" target="_blank" rel="noopener">Ou acessar meu Canal VIP no Telegram 🔞</a>
</dialog>

<!-- Diálogo de Retenção / Saída -->
<dialog id="short-dialog" class="invite-dialog" aria-labelledby="short-dialog-title">
  <button class="short-close" data-close="short-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">😈</span>
  <span class="eyebrow">ESPERA UM SEGUNDO…</span>
  <h2 id="short-dialog-title">Não vai embora<br>sem me espiar... 😉</h2>
  <p>Eu criei um <b>canal 100% gratuito no Telegram</b> pra quem quer ver algumas prévias antes de decidir. Entra lá agora:</p>
  <a id="short-bot" class="contact btn-vip" href="https://t.me/+N0qDwwVScTIxNGMx" target="_blank" rel="noopener">
    👀 Entrar nas Prévias Gratuitas ↗
  </a>
  <button class="starter-choice" id="short-decline">Continuar vendo a página</button>
</dialog>`;
}

