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
      <p class="description">Sem censura, sem filtros e do jeitinho que você sempre quis me ver. Me chama no WhatsApp para liberar seu acesso VIP, vídeos sem censura e agendar nossa chamada ao vivo.</p>
      <div class="trust-tags">
        <span class="tag-item">🔒 100% Discreto</span>
        <span class="tag-item">💬 Atendimento Direto no WhatsApp</span>
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
      </div>
      <a class="preview-skip" href="#previas">Ver prévias em vídeo abaixo ↓</a>
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
  <a href="#acessos" class="gallery-next">Liberar acesso completo no WhatsApp ↓</a>
</section>

<section class="short-offers portal-section" id="acessos" aria-labelledby="offers-title">
  <div class="portal-copy">
    <span class="eyebrow">LIBERAÇÃO IMEDIATA NO WHATSAPP</span>
    <h2 id="offers-title">Escolha como<br><em>quer me ver.</em></h2>
    <p>Todo o meu conteúdo sem censura direto no seu WhatsApp. Escolha o seu pacote e me chame agora para liberar:</p>
  </div>

  <div class="funnel-cards-grid">
    <!-- Card 1: Acesso VIP Completo (WhatsApp) -->
    <div class="funnel-card whatsapp-card" id="whatsapp-vip">
      <div class="whatsapp-ribbon">🔥 MAIS DESEJADO</div>
      <span class="card-badge whatsapp-badge">LIBERAÇÃO IMEDIATA</span>
      <h3>Acesso VIP Privé</h3>
      <p class="card-sub">Meu acervo completo com todos os vídeos explícitos sem cortes e fotos íntimas.</p>
      <ul class="card-checklist">
        <li>🔥 Vídeos explícitos me tocando até gozar</li>
        <li>💦 Fotos e ensaios 100% sem censura</li>
        <li>⚡ Liberação imediata e direta no WhatsApp</li>
        <li>🔒 Cobrança discreta e sigilo absoluto no extrato</li>
      </ul>
      <a class="card-action btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
        <svg class="wp-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <strong>Liberar Meu VIP no WhatsApp 💋</strong>
      </a>
    </div>

    <!-- Card 2: Chamada de Vídeo Privada 1x1 -->
    <div class="funnel-card vip-card" id="whatsapp-call">
      <div class="vip-glow"></div>
      <div class="vip-ribbon">📹 AO VIVO 1X1</div>
      <span class="card-badge vip-badge">🟢 ONLINE AGORA</span>
      <h3>Chamada de Vídeo 1x1</h3>
      <p class="card-sub">Eu e você numa chamada íntima e privativa. Faço tudo o que você me pedir ao vivo.</p>
      <ul class="card-checklist">
        <li>📹 Chamadas de vídeo ao vivo (15 ou 30 min)</li>
        <li>💋 Interação direta no 1x1 sem cortes</li>
        <li>🎙️ Áudios personalizados me tocando</li>
        <li>🔒 100% no sigilo entre nós dois</li>
      </ul>
      <a class="card-action btn-vip" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
        <svg class="wp-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <strong>Agendar Chamada no WhatsApp 💬</strong>
      </a>
    </div>
  </div>

  <div class="free-preview-box">
    <span>💬 Quer tirar dúvidas antes de comprar?</span>
    <a href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">Fale com a Carol no WhatsApp agora →</a>
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
  <span>Carolzinha Privé · 18+ · Atendimento Exclusivo no WhatsApp</span>
  <a href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">Falar com a Carol ↗</a>
</footer>

<!-- Diálogo de Acesso Principal (Fallback) -->
<dialog id="primary-dialog" class="invite-dialog" aria-labelledby="primary-title">
  <button class="short-close" data-close="primary-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">💋</span>
  <span class="eyebrow">ACESSO EXCLUSIVO</span>
  <h2 id="primary-title">Vem falar comigo<br>no WhatsApp.</h2>
  <p>Estou online agora! Me chama no WhatsApp para liberar seu acesso VIP, vídeos sem censura e agendar nossa chamada de vídeo.</p>
  <a class="contact btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
    Chamar no WhatsApp agora 💬
  </a>
</dialog>

<!-- Diálogo de Retenção / Saída -->
<dialog id="short-dialog" class="invite-dialog" aria-labelledby="short-dialog-title">
  <button class="short-close" data-close="short-dialog" aria-label="Fechar convite">×</button>
  <span class="dialog-emblem" aria-hidden="true">😈</span>
  <span class="eyebrow">ESPERA UM SEGUNDO…</span>
  <h2 id="short-dialog-title">Não vai embora<br>sem falar comigo... 😉</h2>
  <p>Eu estou online no WhatsApp agora! Me chama lá para liberar suas prévias e ver as opções de acesso exclusivo:</p>
  <a id="short-bot" class="contact btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
    💬 Chamar a Carol no WhatsApp ↗
  </a>
  <button class="starter-choice" id="short-decline">Continuar vendo a página</button>
</dialog>`;
}


