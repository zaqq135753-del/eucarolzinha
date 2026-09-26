import {siteConfig as c, DEFAULT_WHATSAPP_URL} from './config.js';
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

export function Hero(){
  return `
  <!-- Apple Dynamic Island Header -->
  <header class="dynamic-header">
    <div class="header-brand">
      <span class="brand-logo">Carolzinha<span class="brand-badge">PRIVÉ</span></span>
    </div>

    <div class="dynamic-island" id="dynamic-island" role="button" tabindex="0" aria-label="Status ao vivo">
      <span class="island-dot"></span>
      <span class="island-text" id="island-text">Online no WhatsApp agora</span>
      <span class="island-tag">AO VIVO</span>
    </div>

    <a href="/entrar" class="header-member-btn">Membros ↗</a>
  </header>

  <!-- Hero Section (Mobile-First & Compact) -->
  <section class="experience">
    <div class="ambient-glow" aria-hidden="true"></div>
    <div class="portrait">
      <video id="intro-video" muted loop playsinline webkit-playsinline autoplay preload="auto" aria-label="Vídeo de apresentação da Carolina Satler">
        <source src="${esc(c.heroVideo)}#t=0.8" type="video/mp4">
      </video>
    </div>
    
    <button id="intro-play" class="intro-play" type="button" aria-label="Reproduzir vídeo de apresentação" hidden>
      <span aria-hidden="true">▶</span><span>Toque para ver</span>
    </button>

    <div class="conversation">
      <div class="stage stage-1">
        <div class="tech-chip">
          <span class="chip-spark">✨</span> PRIVÉ · EXCLUSIVO 18+
        </div>
        <h1 class="hero-headline">
          Vem me conhecer.<br>
          <span class="hero-gradient-text">Sem censura.</span>
        </h1>
      </div>

      <div class="stage stage-2">
        <p class="hero-subtext">Vídeos explícitos em 4K sem cortes, fotos íntimas exclusivas e chamada de vídeo 1x1 ao vivo no WhatsApp.</p>
        
        <div class="specs-grid">
          <div class="spec-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>100% Discreto</span>
          </div>
          <div class="spec-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>Liberação Imediata</span>
          </div>
          <div class="spec-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>Atendimento 1x1</span>
          </div>
        </div>
      </div>

      <div class="stage stage-3" id="action">
        <a class="apple-button btn-whatsapp" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
          <div class="btn-glow-layer" aria-hidden="true"></div>
          <svg class="wp-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <div class="btn-label-group">
            <span class="btn-main-title">Falar com a Carol no WhatsApp</span>
            <span class="btn-sub-title">Acesso VIP e atendimento direto 1x1 💬</span>
          </div>
          <span class="btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Interactive Lead Preference Picker (Alta Interação com o Lead) -->
  <div class="picker-container">
    <div class="interactive-picker-card glass-panel" id="preference-picker">
      <div class="picker-header">
        <span class="picker-step">ESCOLHA RÁPIDA</span>
        <h3 class="picker-title">O que você quer ver primeiro?</h3>
        <p class="picker-subtitle">Toque na opção desejada para liberar direto comigo:</p>
      </div>

      <div class="picker-options" role="radiogroup" aria-label="Escolha seu conteúdo">
        <button class="picker-btn active" data-option="Vídeos na Cama" type="button" role="radio" aria-checked="true">
          <span class="picker-emoji" aria-hidden="true">💦</span>
          <div class="picker-info">
            <strong>Vídeos na Cama</strong>
            <small>Me tocando até gozar sem cortes</small>
          </div>
          <span class="picker-check" aria-hidden="true">✓</span>
        </button>

        <button class="picker-btn" data-option="Chamada de Vídeo 1x1" type="button" role="radio" aria-checked="false">
          <span class="picker-emoji" aria-hidden="true">📹</span>
          <div class="picker-info">
            <strong>Chamada de Vídeo 1x1</strong>
            <small>Ao vivo na sua frente no sigilo</small>
          </div>
          <span class="picker-check" aria-hidden="true">✓</span>
        </button>

        <button class="picker-btn" data-option="Fotos & Ensaios Privés" type="button" role="radio" aria-checked="false">
          <span class="picker-emoji" aria-hidden="true">📸</span>
          <div class="picker-info">
            <strong>Fotos & Ensaios Privés</strong>
            <small>Ensaios 100% sem censura e fotos explícitas</small>
          </div>
          <span class="picker-check" aria-hidden="true">✓</span>
        </button>
      </div>

      <div class="picker-feedback" id="picker-feedback">
        <span class="feedback-avatar" aria-hidden="true">💋</span>
        <div class="feedback-bubble">
          <strong>Carolzinha:</strong>
          <span id="feedback-msg">"Adorei sua escolha! Me chama no WhatsApp que eu já te mando essa opção:"</span>
        </div>
      </div>

      <a class="picker-cta btn-whatsapp" id="picker-whatsapp-btn" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
        <svg class="wp-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <span id="picker-btn-text">Liberar Vídeos na Cama no WhatsApp 💬</span>
      </a>
    </div>
  </div>

  <!-- Video Teasers Gallery (Mobile Horizontal Snap Swipe) -->
  <section class="short-gallery" id="previas" aria-labelledby="gallery-title">
    <div class="section-header">
      <span class="tech-chip"><span class="chip-spark">🔥</span> PRÉVIAS REAIS</span>
      <h2 class="section-title" id="gallery-title">Espie só <span class="gradient-accent">um pouco.</span></h2>
      <p class="section-desc">Deslize para ver as prévias reais sem censura:</p>
    </div>

    <div class="media-strip-wrapper">
      <div class="media-strip" aria-label="Galeria de vídeos de prévia">
        <!-- Vídeo 1: Na Intimidade -->
        <figure class="short-video-frame" data-video-card>
          <span class="video-badge">💦 SEM CENSURA</span>
          <span class="video-spec-badge">4K</span>
          <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
            <source src="/assets/video-2.mp4" type="video/mp4">
          </video>
          <button class="gallery-play-btn" aria-label="Reproduzir prévia de vídeo">
            <span aria-hidden="true">▶</span>
            <span class="play-label">Toque para assistir</span>
          </button>
          <figcaption>Na intimidade sem filtro 💦</figcaption>
        </figure>

        <!-- Vídeo 2: No Espelho -->
        <figure class="short-video-frame" data-video-card>
          <span class="video-badge">🔥 NO ESPELHO</span>
          <span class="video-spec-badge">4K</span>
          <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
            <source src="/assets/belovedprestigioussandbarshark.mp4" type="video/mp4">
          </video>
          <button class="gallery-play-btn" aria-label="Reproduzir prévia de vídeo">
            <span aria-hidden="true">▶</span>
            <span class="play-label">Toque para assistir</span>
          </button>
          <figcaption>No espelho me provocando 🔥</figcaption>
        </figure>

        <!-- Vídeo 3: Na Cama -->
        <figure class="short-video-frame" data-video-card>
          <span class="video-badge">🤤 NA CAMA</span>
          <span class="video-spec-badge">1080p 60FPS</span>
          <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
            <source src="/assets/trickyturbulentbrahmancow.mp4" type="video/mp4">
          </video>
          <button class="gallery-play-btn" aria-label="Reproduzir prévia de vídeo">
            <span aria-hidden="true">▶</span>
            <span class="play-label">Toque para assistir</span>
          </button>
          <figcaption>Deitada na cama me tocando 🤤</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- Bento Grid of Offers (Compact Mobile Cards) -->
  <section class="portal-section" id="acessos" aria-labelledby="offers-title">
    <div class="section-header">
      <span class="tech-chip"><span class="chip-spark">⚡</span> ACESSO DIRETO</span>
      <h2 class="section-title" id="offers-title">Escolha como <span class="gradient-accent">quer me ter.</span></h2>
    </div>

    <div class="bento-grid">
      <!-- Bento 1: Acesso VIP Completo (Featured) -->
      <div class="bento-card bento-featured glass-panel" id="whatsapp-vip">
        <div class="bento-glow" aria-hidden="true"></div>
        <div class="bento-header">
          <div class="bento-badge-group">
            <span class="badge-glow">🔥 MAIS PEDIDO</span>
            <span class="badge-subtle">IMEDIATO</span>
          </div>
        </div>
        <h3 class="bento-title">Acesso VIP Privé</h3>
        <p class="bento-desc">Meu acervo completo com todos os vídeos explícitos sem cortes e fotos íntimas direto no seu WhatsApp.</p>
        
        <ul class="bento-check-compact">
          <li><span>✓</span> Vídeos explícitos em 4K me tocando até gozar</li>
          <li><span>✓</span> Fotos e ensaios 100% sem censura</li>
          <li><span>✓</span> Cobrança discreta e sigilo absoluto</li>
        </ul>

        <a class="bento-cta btn-whatsapp" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
          <svg class="wp-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <strong>Liberar VIP no WhatsApp 💋</strong>
        </a>
      </div>

      <!-- Bento 2: Chamada de Vídeo Privada 1x1 -->
      <div class="bento-card glass-panel" id="whatsapp-call">
        <div class="bento-header">
          <span class="badge-live"><span class="live-dot-pulse"></span> AO VIVO 1X1</span>
          <span class="bento-metric">1080p 60FPS</span>
        </div>
        <h3 class="bento-title">Chamada de Vídeo 1x1</h3>
        <p class="bento-desc">Eu e você numa chamada privativa. Faço tudo o que você me pedir em tempo real.</p>
        <ul class="bento-check-compact">
          <li><span>✓</span> Chamada privativa de 15 ou 30 min</li>
          <li><span>✓</span> Conexão segura e sigilosa</li>
        </ul>
        <a class="bento-cta btn-glass" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
          <span>Agendar Chamada 💬</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Mobile Floating Dock Bar (Apple Style) -->
  <div class="apple-dock-bar" id="mobile-dock">
    <div class="dock-profile">
      <span class="dock-avatar">
        <span class="dock-avatar-icon" aria-hidden="true">💋</span>
        <span class="dock-online-dot" aria-hidden="true"></span>
      </span>
      <div class="dock-text">
        <strong>Carolzinha</strong>
        <small>Online no WhatsApp</small>
      </div>
    </div>
    <a class="dock-cta btn-whatsapp" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
      Chamar no WhatsApp 💬
    </a>
  </div>

  <footer class="short-footer">
    <span>Carolzinha Privé · 18+</span>
    <a href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">Chamar no WhatsApp ↗</a>
  </footer>

  <!-- Smart Live Activity Toast (Google / Stripe Style) -->
  <div class="live-toast" id="live-toast" aria-live="polite" hidden>
    <div class="toast-avatar" aria-hidden="true">💋</div>
    <div class="toast-body">
      <div class="toast-title" id="toast-title">Lucas M. (São Paulo)</div>
      <div class="toast-text" id="toast-text">Acabou de liberar o VIP no WhatsApp</div>
      <div class="toast-meta" id="toast-time">há 2 min · ⚡ Verificado</div>
    </div>
    <button class="toast-close" id="toast-close" type="button" aria-label="Fechar notificação">×</button>
  </div>

  <!-- Smart Retention Sheet (Apple Glass Modal) -->
  <dialog id="smart-exit-dialog" class="apple-modal" aria-labelledby="modal-headline">
    <div class="modal-card glass-panel">
      <button class="modal-close" id="modal-close" data-close="smart-exit-dialog" aria-label="Fechar janela">×</button>
      <div class="modal-pill-badge">✨ PRÉVIA SECRETA</div>
      <h2 id="modal-headline" class="modal-title">Antes de ir... <span class="gradient-accent">veja isso.</span></h2>
      <p class="modal-desc">Separei uma prévia secreta em vídeo que não publiquei aqui na página. Clica no botão para receber direto no WhatsApp:</p>
      
      <div class="modal-secret-badge">
        <span class="secret-icon" aria-hidden="true">🎬</span>
        <span class="modal-secret-label">Vídeo secreto sem censura (0:28)</span>
      </div>

      <a class="apple-button btn-whatsapp modal-action" href="${DEFAULT_WHATSAPP_URL}" target="_blank" rel="noopener">
        <svg class="wp-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <span>Receber Vídeo Secreto no WhatsApp 💋</span>
      </a>

      <button class="modal-decline" id="modal-decline" type="button">Continuar na página</button>
    </div>
  </dialog>
`;
}
