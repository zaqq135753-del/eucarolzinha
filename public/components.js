import {siteConfig as c} from './config.js';
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

  <!-- Hero Experience Section -->
  <section class="experience">
    <div class="ambient-glow" aria-hidden="true"></div>
    <div class="portrait">
      <video id="intro-video" muted loop playsinline webkit-playsinline autoplay preload="auto" aria-label="Vídeo de apresentação da Carolina Satler, sem áudio">
        <source src="${esc(c.heroVideo)}#t=0.4" type="video/mp4">
      </video>
    </div>
    
    <button id="intro-play" class="intro-play" type="button" aria-label="Reproduzir vídeo de apresentação" hidden>
      <span aria-hidden="true">▶</span><span>Toque para ver</span>
    </button>

    <div class="conversation">
      <div class="stage stage-1">
        <div class="tech-chip">
          <span class="chip-spark">✨</span> PRIVÉ EXPERIENCE · EXCLUSIVO 18+
        </div>
        <h1 class="hero-headline">
          ${esc(c.headline)} 
          <em class="motion-phrase hero-gradient-text" aria-hidden="true">${esc(c.headlineEmphasis)}</em>
          <span class="sr-only">Mais de perto. No seu tempo. Do seu jeito.</span>
        </h1>
      </div>

      <div class="stage stage-2">
        <p class="hero-subtext">Sem censura, sem filtros e com tecnologia de liberação imediata. Me chama no WhatsApp para desbloquear meu acervo VIP completo, vídeos exclusivos em 4K e chamadas ao vivo no 1x1.</p>
        
        <div class="specs-grid">
          <div class="spec-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>100% Sigiloso & Discreto</span>
          </div>
          <div class="spec-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>Liberação Imediata</span>
          </div>
          <div class="spec-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>Atendimento 1x1</span>
          </div>
        </div>
      </div>

      <div class="stage stage-3" id="action">
        <a class="apple-button btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
          <div class="btn-glow-layer" aria-hidden="true"></div>
          <svg class="wp-svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <div class="btn-label-group">
            <span class="btn-main-title">Falar com a Carol no WhatsApp</span>
            <span class="btn-sub-title">Acesso VIP e conversas íntimas 1x1 💬</span>
          </div>
          <span class="btn-arrow" aria-hidden="true">→</span>
        </a>
        <a class="preview-skip" href="#previas">Ver prévias em vídeo abaixo ↓</a>
        <p class="disclosure">🔞 Conteúdo adulto exclusivo pago · Sigilo absoluto</p>
      </div>
    </div>
  </section>

  <!-- Interactive iOS Voice Note Teaser Card -->
  <div class="voice-teaser-wrap">
    <div class="voice-teaser-card glass-panel" id="voice-teaser">
      <div class="voice-avatar-wrap">
        <span class="voice-avatar" aria-hidden="true">💋</span>
        <span class="voice-status-dot" aria-hidden="true"></span>
      </div>
      <div class="voice-content">
        <div class="voice-header">
          <span class="voice-sender">Carolzinha · Mensagem de voz</span>
          <span class="voice-time">0:18</span>
        </div>
        <div class="voice-player-bar">
          <button class="voice-play-btn" id="voice-play-btn" type="button" aria-label="Reproduzir prévia de voz">
            <span class="voice-btn-icon" aria-hidden="true">▶</span>
          </button>
          <div class="waveform-container" id="waveform" aria-hidden="true">
            <span class="waveform-bar" style="height:35%"></span>
            <span class="waveform-bar" style="height:65%"></span>
            <span class="waveform-bar" style="height:100%"></span>
            <span class="waveform-bar" style="height:55%"></span>
            <span class="waveform-bar" style="height:80%"></span>
            <span class="waveform-bar" style="height:40%"></span>
            <span class="waveform-bar" style="height:90%"></span>
            <span class="waveform-bar" style="height:70%"></span>
            <span class="waveform-bar" style="height:85%"></span>
            <span class="waveform-bar" style="height:50%"></span>
            <span class="waveform-bar" style="height:75%"></span>
            <span class="waveform-bar" style="height:95%"></span>
            <span class="waveform-bar" style="height:60%"></span>
            <span class="waveform-bar" style="height:45%"></span>
            <span class="waveform-bar" style="height:80%"></span>
            <span class="waveform-bar" style="height:35%"></span>
            <span class="waveform-bar" style="height:65%"></span>
            <span class="waveform-bar" style="height:85%"></span>
            <span class="waveform-bar" style="height:40%"></span>
          </div>
        </div>
        <div class="voice-footer">
          <span class="voice-hint">"Oi amor, acabei de deitar... me chama no WhatsApp pra gente conversar 😉"</span>
          <a class="voice-cta" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">Ouvir no WhatsApp 💬</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 4K Video Teasers Gallery -->
  <section class="short-gallery" id="previas" aria-labelledby="gallery-title">
    <div class="section-header">
      <span class="tech-chip"><span class="chip-spark">🔥</span> PRÉVIAS EM ALTA DEFINIÇÃO</span>
      <h2 class="section-title" id="gallery-title">Você viu só <span class="gradient-accent">o começo.</span></h2>
      <p class="section-desc">Gravei essas prévias em vídeo para você sentir o clima do que te espera no meu espaço VIP. Dá o play com som:</p>
    </div>

    <div class="media-strip" aria-label="Galeria de vídeos de prévia">
      <!-- Vídeo 1: Na Intimidade -->
      <figure class="short-video-frame" data-video-card>
        <span class="video-badge">💦 SEM CENSURA</span>
        <span class="video-spec-badge">4K 60FPS</span>
        <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
          <source src="/assets/video-2.mp4" type="video/mp4">
        </video>
        <button class="gallery-play-btn" aria-label="Reproduzir prévia com áudio">
          <span aria-hidden="true">▶</span>
          <span class="play-label">Assistir com áudio</span>
        </button>
        <figcaption>Na intimidade sem filtro 💦</figcaption>
      </figure>

      <!-- Vídeo 2: No Espelho -->
      <figure class="short-video-frame" data-video-card>
        <span class="video-badge">🔥 NO ESPELHO</span>
        <span class="video-spec-badge">4K ULTRA</span>
        <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
          <source src="/assets/belovedprestigioussandbarshark.mp4" type="video/mp4">
        </video>
        <button class="gallery-play-btn" aria-label="Reproduzir prévia com áudio">
          <span aria-hidden="true">▶</span>
          <span class="play-label">Assistir com áudio</span>
        </button>
        <figcaption>No espelho me provocando 🔥</figcaption>
      </figure>

      <!-- Vídeo 3: Na Cama -->
      <figure class="short-video-frame" data-video-card>
        <span class="video-badge">🤤 NA CAMA</span>
        <span class="video-spec-badge">SOM REAL</span>
        <video class="gallery-video" muted playsinline webkit-playsinline preload="metadata">
          <source src="/assets/trickyturbulentbrahmancow.mp4" type="video/mp4">
        </video>
        <button class="gallery-play-btn" aria-label="Reproduzir prévia com áudio">
          <span aria-hidden="true">▶</span>
          <span class="play-label">Assistir com áudio</span>
        </button>
        <figcaption>Deitada na cama me tocando 🤤</figcaption>
      </figure>
    </div>
    
    <a href="#acessos" class="gallery-next">Desbloquear acervo completo no WhatsApp ↓</a>
  </section>

  <!-- Bento Grid of Offers (Apple / IBM Style) -->
  <section class="portal-section" id="acessos" aria-labelledby="offers-title">
    <div class="section-header">
      <span class="tech-chip"><span class="chip-spark">⚡</span> EXPERIÊNCIA PRIVADA NO WHATSAPP</span>
      <h2 class="section-title" id="offers-title">Escolha como <span class="gradient-accent">quer me ver.</span></h2>
      <p class="section-desc">Sem filas, sem cadastros longos. Você conversa diretamente comigo no WhatsApp para liberar acesso imediato:</p>
    </div>

    <div class="bento-grid">
      <!-- Bento 1: Acesso VIP Completo (Featured) -->
      <div class="bento-card bento-featured glass-panel" id="whatsapp-vip">
        <div class="bento-glow" aria-hidden="true"></div>
        <div class="bento-header">
          <div class="bento-badge-group">
            <span class="badge-glow">🔥 MAIS DESEJADO</span>
            <span class="badge-subtle">ACESSO IMEDIATO</span>
          </div>
          <span class="bento-metric">ATUALIZAÇÕES SEMANAIS</span>
        </div>
        <h3 class="bento-title">Acesso VIP Privé</h3>
        <p class="bento-desc">Meu acervo completo com todos os vídeos explícitos sem cortes, ensaios fotográficos e atualizações frequentes liberados no seu WhatsApp.</p>
        
        <div class="bento-features">
          <div class="feature-row">
            <div class="feature-icon-box">✓</div>
            <div class="feature-text">
              <strong>Vídeos Explícitos sem Censura</strong>
              <span>Me tocando até gozar com gemidos reais sem cortes</span>
            </div>
          </div>
          <div class="feature-row">
            <div class="feature-icon-box">✓</div>
            <div class="feature-text">
              <strong>Fotos e Ensaios Íntimos</strong>
              <span>Todos os ângulos mais quentes e exclusivos</span>
            </div>
          </div>
          <div class="feature-row">
            <div class="feature-icon-box">✓</div>
            <div class="feature-text">
              <strong>Sigilo Absoluto & Extrato Discreto</strong>
              <span>Cobrança discreta no extrato e privacidade 100% garantida</span>
            </div>
          </div>
        </div>

        <a class="bento-cta btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
          <svg class="wp-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
          </svg>
          <strong>Liberar Meu VIP no WhatsApp 💋</strong>
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
          <li><span>📹</span> Chamada privativa de 15 ou 30 min</li>
          <li><span>🔒</span> Conexão direta e segura no sigilo</li>
          <li><span>🔥</span> Você no controle do que eu vou fazer</li>
        </ul>
        <a class="bento-cta btn-glass" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
          <span>Agendar Minha Chamada 💬</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <!-- Bento 3: Áudios & Mídias Sob Medida -->
      <div class="bento-card glass-panel" id="whatsapp-custom">
        <div class="bento-header">
          <span class="badge-subtle">🎙️ PERSONALIZADO</span>
          <span class="bento-metric">SOB ENCOMENDA</span>
        </div>
        <h3 class="bento-title">Áudios & Mídias Exclusivas</h3>
        <p class="bento-desc">Áudios gemendo o seu nome, fotos dedicadas com plaquinha e vídeos na pose que você escolher.</p>
        <a class="bento-cta btn-glass" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
          <span>Pedir Conteúdo Especial ↗</span>
        </a>
      </div>
    </div>

    <div class="free-help-box">
      <span>💬 Tem alguma dúvida antes de liberar?</span>
      <a href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">Fale comigo no WhatsApp agora →</a>
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
        <small>Online no WhatsApp agora</small>
      </div>
    </div>
    <a class="dock-cta btn-whatsapp" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
      Chamar no WhatsApp 💬
    </a>
  </div>

  <footer class="short-footer">
    <span>Carolzinha Privé · 18+ · Atendimento Exclusivo no WhatsApp</span>
    <a href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">Chamar no WhatsApp ↗</a>
  </footer>

  <!-- Smart Live Activity Toast (Google / Stripe Style) -->
  <div class="live-toast" id="live-toast" aria-live="polite" hidden>
    <div class="toast-avatar" aria-hidden="true">💋</div>
    <div class="toast-body">
      <div class="toast-title" id="toast-title">Lucas M. de São Paulo</div>
      <div class="toast-text" id="toast-text">Acabou de liberar o VIP no WhatsApp</div>
      <div class="toast-meta" id="toast-time">há 2 min · ⚡ Verificado</div>
    </div>
    <button class="toast-close" id="toast-close" type="button" aria-label="Fechar notificação">×</button>
  </div>

  <!-- Smart Retention Sheet (Apple Glass Modal) -->
  <dialog id="smart-exit-dialog" class="apple-modal" aria-labelledby="modal-headline">
    <div class="modal-card glass-panel">
      <button class="modal-close" id="modal-close" data-close="smart-exit-dialog" aria-label="Fechar janela">×</button>
      <div class="modal-pill-badge">✨ PRÉVIA SECRETA LIBERADA</div>
      <h2 id="modal-headline" class="modal-title">Antes de ir... <span class="gradient-accent">ouça isso.</span></h2>
      <p class="modal-desc">Eu separei um áudio e uma prévia secreta que não publiquei aqui na página. Clica no botão abaixo para receber direto no WhatsApp:</p>
      
      <div class="modal-voice-preview">
        <div class="modal-voice-bars" aria-hidden="true">
          <span class="voice-anim-bar"></span>
          <span class="voice-anim-bar"></span>
          <span class="voice-anim-bar"></span>
          <span class="voice-anim-bar"></span>
          <span class="voice-anim-bar"></span>
        </div>
        <span class="modal-voice-label">Áudio de Carolzinha gravado há 3 min (0:19)</span>
      </div>

      <a class="apple-button btn-whatsapp modal-action" href="https://wa.me/message/AYCUNLYYIOSZO1" target="_blank" rel="noopener">
        <svg class="wp-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 012.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
        </svg>
        <span>Receber Áudio Secreto no WhatsApp 💋</span>
      </a>

      <button class="modal-decline" id="modal-decline" type="button">Prefiro continuar na página</button>
    </div>
  </dialog>
`;
}
