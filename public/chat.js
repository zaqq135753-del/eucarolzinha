// ======================================================
// TELEGRAM WEB CHAT - FLUXO NATIVO NA PRE-SELL
// ======================================================

import {
  trackChatOpened,
  trackPreview1,
  trackPreview2Click,
  trackPreview2View,
  trackGiftRequest,
  trackGift,
  trackPlansView,
  trackInitiateCheckout,
  trackPixCopied,
  trackPushinPayClick,
  trackPaymentCheckRequested,
  trackPurchase,
  trackUpsell1View,
  trackUpsell1Purchase,
  trackUpsell2View,
  trackUpsell2Purchase,
  trackCompleteRegistration,
  BACKEND_URL,
  getVisitorId
} from './tracking.js';

const ABACATEPAY_CHECKOUT_URL = 'https://app.abacatepay.com/pay/bill_wrSrJjhK4NNK02Ymcqtnk5Ck';
const CHECKOUT_PAY_URL = ABACATEPAY_CHECKOUT_URL;

const TELEGRAM_DIRECT_URL = 'https://t.me/eucarolzinha_bot?start=site';

// Pool de mídias dinâmicas para rotação aleatória no funil
const MEDIA_POOLS = {
  preview1: [
    { url: '/assets/previa-1.mp4', name: 'previa_cama_1' },
    { url: '/assets/video-1.mp4', name: 'video_1' },
    { url: '/assets/darkredtartbarnowl.mp4', name: 'previa_quarto_dark' },
    { url: '/assets/story-1.mp4', name: 'previa_story_1' }
  ],
  preview2: [
    { url: '/assets/previa-2.mp4', name: 'previa_mao_2' },
    { url: '/assets/trickyturbulentbrahmancow.mp4', name: 'previa_calcinha_tricky' },
    { url: '/assets/story-2.mp4', name: 'previa_story_2' }
  ],
  gift: [
    { url: '/assets/video-2.mp4', name: 'presente_video_2' },
    { url: '/assets/video-4.mp4', name: 'presente_video_4' },
    { url: '/assets/video-9.mp4', name: 'presente_video_9' },
    { url: '/assets/previa-3.mp4', name: 'presente_sem_censura_3' },
    { url: '/assets/belovedprestigioussandbarshark.mp4', name: 'presente_sandbar' },
    { url: '/assets/story-3.mp4', name: 'presente_story_3' }
  ]
};

function pickRandomMedia(poolKey) {
  const list = MEDIA_POOLS[poolKey] || [];
  return list[Math.floor(Math.random() * list.length)] || list[0];
}

export class TelegramWebChat {
  constructor(options = {}) {
    this.target = options.target || document.body;
    this.isModal = options.isModal !== false;
    this.onClose = options.onClose || (() => {});
    this.state = {
      step: 'start',
      selectedPlan: '15d',
      paidPending: false
    };

    // Acervo oficial dos 5 vídeos do funil
    this.videos = {
      video1: { url: '/assets/video-1.mp4', name: 'video_1' },
      video3: { url: '/assets/video-3.mp4', name: 'video_3' },
      previa3: { url: '/assets/previa-3.mp4', name: 'previa_3' },
      previa2: { url: '/assets/previa-2.mp4', name: 'previa_2' },
      previa1: { url: '/assets/previa-1.mp4', name: 'previa_1' }
    };

    this.render();
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  render() {
    const html = `
      <div class="tg-modal-overlay" id="tg-chat-overlay">
        <div class="tg-chat-container">
          <!-- Header -->
          <header class="tg-header">
            <button class="tg-back-btn" id="tg-close-btn" aria-label="Voltar">✕</button>
            <div class="tg-avatar-wrap">
              <img src="/assets/carol-avatar.jpg" alt="Carolzinha" class="tg-avatar" />
              <span class="tg-status-dot"></span>
            </div>
            <div class="tg-user-info">
              <div class="tg-user-name">
                Carolzinha Satler <span class="tg-verified">✓</span>
              </div>
              <div class="tg-user-status" id="tg-user-status">online agora</div>
            </div>
            <div class="tg-header-actions">
              <span class="tg-vip-badge">💎 VIP PRIVADO</span>
              <a href="${TELEGRAM_DIRECT_URL}" target="_blank" rel="noopener" class="tg-app-switch" title="Abrir no app do Telegram">
                Abrir App ↗
              </a>
            </div>
          </header>

          <!-- Mensagens -->
          <main class="tg-messages" id="tg-messages">
            <div class="tg-encryption-notice">🔒 Chat Privado Criptografado • Sigilo Total</div>
          </main>

          <!-- Footer / Ações de Resposta Rápida -->
          <footer class="tg-action-footer" id="tg-action-footer"></footer>
        </div>
      </div>
    `;

    if (this.isModal) {
      const existing = document.getElementById('tg-chat-overlay');
      if (existing) existing.remove();
      const div = document.createElement('div');
      div.innerHTML = html.trim();
      const overlayEl = div.firstElementChild;
      this.target.appendChild(overlayEl);
      this.overlay = document.getElementById('tg-chat-overlay') || overlayEl;
      this.container = this.overlay.querySelector('.tg-chat-container');
    } else {
      this.target.innerHTML = html.trim();
      this.overlay = this.target.querySelector('.tg-modal-overlay');
      if (this.overlay) {
        this.overlay.classList.add('active');
        this.overlay.style.position = 'relative';
      }
      this.container = this.target.querySelector('.tg-chat-container');
    }

    this.messagesEl = this.overlay?.querySelector('#tg-messages') || document.getElementById('tg-messages');
    this.footerEl = this.overlay?.querySelector('#tg-action-footer') || document.getElementById('tg-action-footer');
    this.statusEl = this.overlay?.querySelector('#tg-user-status') || document.getElementById('tg-user-status');

    const closeBtn = this.overlay?.querySelector('#tg-close-btn') || document.getElementById('tg-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }
  }

  isOpen() {
    return Boolean(this.overlay && this.overlay.classList.contains('active'));
  }

  open() {
    if (this.overlay) {
      this.state.opened = true;
      this.overlay.classList.add('active');
      try {
        if (typeof trackChatOpened === 'function') {
          trackChatOpened('presell_funnel');
        }
      } catch (err) {
        console.warn('[Chat] Track error ignorado:', err);
      }
      const params = new URLSearchParams(location.search);
      if (params.get('status') === 'approved' || params.get('paid') === '1' || params.get('demo_approved') === '1') {
        this.showPaidSuccess().catch(() => {});
      } else if (this.state.step === 'start') {
        this.startFunnel().catch(err => {
          console.error('[Chat] Erro no startFunnel:', err);
        });
      }
    }
  }

  async showPaidSuccess() {
    this.state.step = 'paid_approved';
    const planKey = new URLSearchParams(location.search).get('plan') || '15d';
    const planPricesNum = { '7d': 8.90, '15d': 14.90, '30d': 24.90 };
    const paidValue = planPricesNum[planKey] || 14.90;
    const txId = new URLSearchParams(location.search).get('tx') || `tx_pushin_${Date.now()}`;
    trackPurchase(paidValue, txId);

    await this.showTyping('confirmando compensação do Pix...', 1200);
    this.addMessage(
      '🎉 <b>PAGAMENTO CONFIRMADO COM SUCESSO!</b> 🥰🔥\n\n' +
      'seu acesso ao VIP já tá liberado! Mas antes de você entrar no Telegram, olha o que eu separei exclusivamente pra você:'
    );
    this.showUpsell1App();
  }

  close() {
    if (this.overlay && this.isModal) {
      this.overlay.classList.remove('active');
      // Pausa vídeos em execução
      this.messagesEl.querySelectorAll('video').forEach(v => v.pause());
      this.onClose();
    }
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }

  setStatus(text, isTyping = false) {
    if (!this.statusEl) return;
    this.statusEl.textContent = text;
    if (isTyping) {
      this.statusEl.classList.add('typing');
    } else {
      this.statusEl.classList.remove('typing');
    }
  }

  showTyping(label = 'digitando...', duration = 2500) {
    return new Promise(resolve => {
      this.setStatus(label, true);
      const typingEl = document.createElement('div');
      typingEl.className = 'tg-msg tg-msg-in';
      typingEl.id = 'tg-typing-indicator';
      typingEl.innerHTML = `
        <div class="tg-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      `;
      this.messagesEl.appendChild(typingEl);
      this.scrollToBottom();

      setTimeout(() => {
        typingEl.remove();
        this.setStatus('online', false);
        resolve();
      }, duration);
    });
  }

  addMessage(content, type = 'in', extra = {}) {
    const time = this.getCurrentTime();
    const msg = document.createElement('div');
    msg.className = `tg-msg tg-msg-${type}`;

    let innerContent = '';
    if (extra.video) {
      innerContent += `
        <div class="tg-video-wrap">
          <video class="tg-video" src="${extra.video}" muted playsinline webkit-playsinline loop preload="auto"></video>
          <div class="tg-video-overlay-btn">▶</div>
          <button class="tg-video-sound-btn" type="button">🔊 Som</button>
        </div>
      `;
    }

    if (content) {
      innerContent += `
        <div class="tg-bubble">
          ${content.replace(/\n/g, '<br>')}
          <span class="tg-msg-time">${time} ${type === 'out' ? '✓✓' : ''}</span>
        </div>
      `;
    }

    msg.innerHTML = innerContent;
    this.messagesEl.appendChild(msg);

    // Eventos de vídeo (Play/Pause e Som)
    if (extra.video) {
      const wrap = msg.querySelector('.tg-video-wrap');
      const video = msg.querySelector('video');
      const soundBtn = msg.querySelector('.tg-video-sound-btn');

      video.muted = true;
      video.play().then(() => {
        wrap.classList.add('playing');
      }).catch(() => {
        wrap.classList.remove('playing');
      });

      wrap.onclick = (e) => {
        if (e.target === soundBtn) return;
        if (video.paused) {
          video.play();
          wrap.classList.add('playing');
        } else {
          video.pause();
          wrap.classList.remove('playing');
        }
      };

      soundBtn.onclick = (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        soundBtn.textContent = video.muted ? '🔇 Mudo' : '🔊 Ouvindo';
        soundBtn.style.background = video.muted ? 'rgba(0,0,0,0.75)' : '#e63973';
      };
    }

    this.scrollToBottom();
    return msg;
  }

  deleteMessage(msgEl, reason = 'Esta mensagem foi apagada') {
    if (!msgEl) return;
    const time = this.getCurrentTime();
    msgEl.classList.add('tg-msg-deleted');
    msgEl.innerHTML = `
      <div class="tg-bubble tg-bubble-deleted">
        <span class="tg-deleted-icon">🚫</span>
        <em>${reason}</em>
        <span class="tg-msg-time">${time}</span>
      </div>
    `;
    this.scrollToBottom();
  }

  setActions(buttons = []) {
    this.footerEl.innerHTML = '';
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `tg-quick-reply-btn ${btn.secondary ? 'secondary' : ''}`;
      button.type = 'button';
      button.innerHTML = btn.label;
      button.onclick = () => {
        this.footerEl.innerHTML = '';
        btn.onClick();
      };
      this.footerEl.appendChild(button);
    });
    this.scrollToBottom();
  }

  // =====================================================
  // FLUXO DO FUNIL DE CONVERSÃO
  // =====================================================

  // =====================================================
  // FLUXO DO FUNIL DE CONVERSÃO HUMANIZADO COM GÍRIAS
  // =====================================================

  async startFunnel() {
    this.state.step = 'intro';
    await this.showTyping('digitando...', 1000);

    this.addMessage(
      'tava aqui na cama pegando fogo de tédio e não aguentei... tive que gravar isso agorinha 👀🔥'
    );

    // Entrada: vídeo 3 toca por 3.5s e apaga
    await this.showTyping('enviando vídeo...', 1000);
    const wrongVideoMsg = this.addMessage('', 'in', { video: this.videos.video3.url });

    // Permite reproduzir por 3.5 segundos para atiçar a curiosidade
    await new Promise(r => setTimeout(r, 3500));

    // Apaga a mensagem na frente do lead
    this.deleteMessage(wrongVideoMsg, '🚫 Esta mensagem foi apagada por Carolzinha');

    await this.showTyping('digitando rápido...', 800);
    this.addMessage(
      'CARALHO APAGA ISSO KKKKKK 🙈🙈 socorro mandei no chat errado que vergonhaaaa\n\n' +
      'fala que você não viu isso pfv 👀🔥 quase morri aqui'
    );

    // INTERAÇÃO IMEDIATA: O lead escolhe como responder!
    this.setActions([
      {
        label: '😈 Eu vi tudinho, que gostosa... 🔥',
        onClick: () => this.handleAfterDeletedChoice('😈 Eu vi tudinho, que gostosa... 🔥')
      },
      {
        label: '🙈 Não deu pra ver direito, me mostra de novo! 👀',
        onClick: () => this.handleAfterDeletedChoice('🙈 Não deu pra ver direito, me mostra de novo! 👀')
      },
      {
        label: '🔥 Quero ir direto pro VIP sem censura (R$ 9,90) 🤤',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 Quero ir direto pro VIP sem censura (R$ 9,90) 🤤')
      }
    ]);
  }

  async handleAfterDeletedChoice(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1100);
    this.addMessage(
      'era pra te mandar esse aqui... mas promete que não vaza pra ninguém o que você viu?? 🙈🤤\n\n' +
      'olha esse aqui então... coloca o fone de ouvido aí e assiste com calma 👇👅💦'
    );

    // Envia o vídeo 1!
    await this.showTyping('enviando vídeo...', 1100);
    this.addMessage('', 'in', { video: this.videos.video1.url });
    try { trackPreview1(this.videos.video1.name); } catch {}

    this.setActions([
      {
        label: '👀 Desce essa mão logo, quero ver mais 🔥',
        onClick: () => this.handleStep1Choice('👀 Desce essa mão logo, quero ver mais 🔥')
      },
      {
        label: '🔥 Quero entrar no privado agora (R$ 9,90) 😈',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 Quero entrar no privado agora (R$ 9,90) 😈')
      }
    ]);
  }

  async handleStep1Choice(userText) {
    try { trackPreview2Click(userText); } catch {}
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1100);

    this.addMessage(
      'sabia que você ia querer ver... safado né? 😂🔥\n\n' +
      'nessa aqui eu já tava sem calcinha nenhuma me tocando... olha a mão descendo devagarzinho aqui 👇🍑💦'
    );

    // Envia a prévia 3!
    await this.showTyping('enviando vídeo...', 1200);
    this.addMessage('', 'in', { video: this.videos.previa3.url });
    try { trackPreview2View(this.videos.previa3.name); } catch {}

    await this.showTyping('digitando...', 1100);

    this.addMessage(
      'gravei um bagulho bem mais pesado aqui agorinha na cama... bem safado mesmo, nem devia te soltar isso aqui 👀🙈\n\n' +
      'quer ver agora?'
    );

    this.setActions([
      {
        label: '🎁 Me manda isso agora, quero ver tudo 🤤',
        onClick: () => this.handleGiftStep('🎁 Me manda isso agora, quero ver tudo 🤤')
      },
      {
        label: '🔥 Quero entrar no VIP completo agora 😈',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 Quero entrar no VIP completo agora 😈')
      }
    ]);
  }

  async handleGiftStep(userText) {
    try { trackGiftRequest(userText); } catch {}
    this.addMessage(userText, 'out');
    await this.showTyping('gravando...', 1200);

    this.addMessage(
      'resolvi te soltar então... mas não vaza isso de jeito nenhum hein? 🙈🎁\n\n' +
      'olha como eu fico quando tô pegando fogo na cama... 🤤💦\n\n' +
      'coloca o fone que o gemidinho tá baixo... assiste até o finalzinho 👇👅'
    );

    // Envia a prévia 2!
    await this.showTyping('enviando vídeo exclusivo...', 1200);
    this.addMessage('', 'in', { video: this.videos.previa2.url });
    try { trackGift(this.videos.previa2.name); } catch {}

    await this.showTyping('digitando...', 1000);
    this.addMessage(
      'gostou? 🤤💦 mó delícia gravar isso...\n\n' +
      'imagina eu todinha pra você todo santo dia no meu privado, gemendo no seu ouvido e fazendo tudo que você mandar sem censura nenhuma... 🔞🔥'
    );

    this.setActions([
      {
        label: '🔞 Me mostra a última prévia mais pesada 🤤',
        onClick: () => this.handleLastPreviewStep('🔞 Me mostra a última prévia mais pesada 🤤')
      },
      {
        label: '🔥 Quero entrar no VIP agora por R$ 9,90 🤤',
        secondary: true,
        onClick: () => this.handlePlanSelected('7d', '🔥 Quero entrar no VIP agora por R$ 9,90 🤤')
      }
    ]);
  }

  async handleLastPreviewStep(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1000);

    this.addMessage(
      'se você já pirou nesses, segura essa aqui... 🤤🔥\n\n' +
      'esse é o mais forte que eu já gravei fora do VIP! Olha como eu fico molhadinha de verdade 👇🔞💦'
    );

    // Envia a prévia 1!
    await this.showTyping('enviando o mais forte...', 1200);
    this.addMessage('', 'in', { video: this.videos.previa1.url });

    await this.showTyping('digitando...', 1000);
    this.addMessage(
      'agora chega de passar vontade sozinho na mão... 🥵💦\n\n' +
      'no meu VIP eu tô sem calcinha te esperando, gemendo no seu ouvido e gravando tudo que você pedir sem censura!\n\n' +
      'toca aqui embaixo pra gente curtir agora 👇💋'
    );

    this.setActions([
      {
        label: '🔥 Entrar no VIP agora por R$ 9,90 🤤',
        onClick: () => this.handlePlanSelected('7d', '🔥 Entrar no VIP agora por R$ 9,90 🤤')
      },
      {
        label: '👀 O que mais tem lá dentro? 😈',
        secondary: true,
        onClick: () => this.handleBenefits('👀 O que mais tem lá dentro? 😈')
      }
    ]);
  }

  async handleBenefits(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1200);

    this.addMessage(
      'quando você destranca o acesso, você fica direto comigo aqui no meu chat pessoal, sem ninguém te vigiando... 🤫💋\n\n' +
      'lá eu me entrego 100% pra você todo santo dia:\n\n' +
      '🔥 <b>Vídeos sem censura nenhuma:</b> me masturbando todinha, usando brinquedinhos e chupando gostoso 🔞💦\n' +
      '📸 <b>Fotinhas no espelho:</b> bem de pertinho, sem calcinha, molhadinha só pra você 🍑🤤\n' +
      '🎥 <b>Gravações proibidas:</b> que o Instagram baniria em 5 segundos 😈\n' +
      '💬 <b>Conversa íntima no privado:</b> te mando áudio todo dia falando seu nome bem baixinho 🎧👅\n' +
      '✨ <b>Conteúdo novo diário:</b> pra você nunca mais dormir sozinho na vontade!\n\n' +
      '🔒 <b>100% DISCRETO E NO SIGILO:</b> No seu extrato bancário NÃO aparece nada adulto nem meu nome. Aparece apenas uma taxa neutra de tecnologia.\n\n' +
      '⚡ <b>LIBERAÇÃO INSTANTÂNEA:</b> Pagou no Pix, em 10 segundos já libera a chave do meu quarto pra gente curtir agora!\n\n' +
      'não vai me deixar na vontade aqui sozinha passando a mão né?'
    );

    this.setActions([
      {
        label: '🔥 Liberar meu acesso por R$ 9,90 no Pix 🤤',
        onClick: () => this.handlePlanSelected('7d', '🔥 Liberar meu acesso por R$ 9,90 no Pix 🤤')
      }
    ]);
  }

  async handleDirectPlans(userText) {
    return this.handlePlanSelected('7d', userText || '🔥 Quero entrar no VIP agora por R$ 9,90 🤤');
  }

  startPixTimer(container) {
    if (this.pixTimerInterval) clearInterval(this.pixTimerInterval);
    let secondsLeft = 600; // 10 minutos
    const timerEl = container.querySelector('#tg-pix-timer-count');
    if (!timerEl) return;

    this.pixTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.pixTimerInterval);
        timerEl.textContent = '00:00';
        return;
      }
      const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
      const secs = String(secondsLeft % 60).padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  async handlePlanSelected(planKey = '7d', userText = null) {
    if (this.plansAbandonTimeout) clearTimeout(this.plansAbandonTimeout);
    this.state.step = 'checkout';
    this.state.selectedPlan = planKey;
    const planName = 'Acesso VIP Completo (R$ 9,90)';
    const planPrice = 'R$ 9,90';
    const planPriceNum = 9.90;
    let planUrl = CHECKOUT_PAY_URL;
    const visitorId = getVisitorId();

    // Dispara Eventos do Funil
    try { trackPlansView(); } catch {}
    try { trackInitiateCheckout('7d', 9.90); } catch {}

    if (userText) {
      this.addMessage(userText, 'out');
    } else {
      this.addMessage(`Quero o ${planName} 🔥`, 'out');
    }

    await this.showTyping('gerando chave oficial no Pix...', 1000);

    // Geração dinâmica de Checkout Oficial via AbacatePay API em background
    let checkoutData = null;
    try {
      const res = await fetch('/api/abacatepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, returnUrl: window.location.href })
      });
      if (res.ok) {
        checkoutData = await res.json();
        if (checkoutData?.checkoutUrl) {
          planUrl = checkoutData.checkoutUrl;
        }
      }
    } catch (e) {
      console.warn('[Chat] Usando link oficial direto do AbacatePay:', e);
    }

    this.addMessage(
      '🔥 <b>separei sua vaga no sigilo total!</b> 🔑🤤\n\n' +
      '🔒 <i>pagamento 100% discreto: no seu extrato bancário NÃO aparece nada adulto nem meu nome. Aparece apenas uma taxa neutra de tecnologia.</i>\n\n' +
      'toque no botão verde abaixo para gerar seu Pix oficial do Banco Central e liberar seu quarto na mesma hora 👇💋'
    );

    const checkoutCard = document.createElement('div');
    checkoutCard.className = 'tg-checkout-card';
    checkoutCard.innerHTML = `
      <div class="tg-checkout-header">
        <span class="tg-checkout-badge">⚡ Liberação Imediata • Vaga Exclusiva</span>
        <span class="tg-pix-timer">⏳ Garanta por <strong id="tg-pix-timer-count">10:00</strong></span>
      </div>

      <div class="tg-pix-value-tag" style="margin:12px 0 10px 0;background:rgba(230,57,115,0.12);border:1px solid rgba(230,57,115,0.3);padding:14px;border-radius:14px;text-align:center">
        <div style="font-size:12px;color:#94a3b8;font-weight:600;letter-spacing:0.5px">VALOR PROMOCIONAL ÚNICO</div>
        <div style="font-size:26px;font-weight:900;color:#4bd865;margin:4px 0">
          ${planPrice} <small style="font-size:14px;color:#94a3b8;font-weight:400;text-decoration:line-through">R$ 79,90</small>
        </div>
        <div style="font-size:12px;color:#cbd5e1;font-weight:500">Acesso VIP Completo + Chat Privado + Todas as Mídias Proibidas</div>
      </div>

      <!-- BOTÃO DE 1 CLIQUE DIRETO (PIX OFICIAL ABACATEPAY) -->
      <a href="${planUrl}" class="tg-pix-simulate-btn" id="tg-real-pay" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:900;font-size:15.5px;padding:17px 18px;border-radius:14px;box-shadow:0 8px 26px rgba(34,197,94,0.45);margin:12px 0 10px 0;animation:tgPulseGreen 2s infinite">
        👉 PAGAR R$ 9,90 NO PIX OFICIAL 🔒
      </a>

      <div style="font-size:11.5px;color:#94a3b8;text-align:center;line-height:1.4;margin:6px 0">
        🛡️ Chave Pix oficial do Banco Central com liberação instantânea.<br>
        🤫 Sigilo absoluto: não aparece nome adulto no extrato.
      </div>
    `;

    this.messagesEl.appendChild(checkoutCard);
    this.scrollToBottom();
    this.startPixTimer(checkoutCard);

    const goToPay = () => {
      try {
        trackPushinPayClick('7d', planPriceNum);
        trackInitiateCheckout('7d', planPriceNum);
        trackPixCopied(planPriceNum);
      } catch {}
      window.location.href = planUrl;
    };

    const payLink = checkoutCard.querySelector('#tg-real-pay');
    if (payLink) {
      payLink.onclick = (e) => {
        e.preventDefault();
        goToPay();
      };
    }

    // Botão fixo no rodapé para máxima facilidade de clique no mobile
    this.setActions([
      {
        label: '👉 PAGAR R$ 9,90 NO PIX OFICIAL 🔒',
        onClick: () => goToPay()
      }
    ]);

    // Auto-polling automático caso retorne ou complete via webhook
    if (checkoutData?.checkoutId) {
      if (this.pixPollingInterval) clearInterval(this.pixPollingInterval);
      this.pixPollingInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/abacatepay?id=${checkoutData.checkoutId}`);
          if (checkRes.ok) {
            const statusData = await checkRes.json();
            if (statusData.isPaid) {
              clearInterval(this.pixPollingInterval);
              if (this.pixTimerInterval) clearInterval(this.pixTimerInterval);
              trackPurchase(planPriceNum, checkoutData.checkoutId);
              this.showPaidSuccess();
            }
          }
        } catch {}
      }, 3500);
    }

    // Anti-abandono de 20s
    this.plansAbandonTimeout = setTimeout(async () => {
      if (this.state.step !== 'checkout') return;
      await this.showTyping('digitando...', 1000);
      this.addMessage(
        'sumiu? ficou na dúvida? 🙈\n\n' +
        'é só <b>R$ 9,90 no Pix</b>, menos que uma cerveja pra me ter pelada sem censura no sigilo total! Toca no botão verde e vem cá 👇💋'
      );
    }, 20000);
  }

  async handlePaymentCheck(checkoutCard, planUrl, planPriceStr, checkoutId = null) {
    if (checkoutCard) {
      const statusText = checkoutCard.querySelector('#tg-status-text');
      const dot = checkoutCard.querySelector('#tg-status-dot');
      if (statusText) statusText.textContent = 'Sincronizando com o banco e verificando Pix...';
      if (dot) dot.style.background = '#eab308';
      const checkBtn = checkoutCard.querySelector('#tg-check-pay');
      if (checkBtn) {
        checkBtn.disabled = true;
        checkBtn.style.opacity = '0.7';
        checkBtn.innerHTML = '<span class="tg-pulse-dot" style="background:#facc15;width:8px;height:8px;display:inline-block;border-radius:50%"></span> <span>⏳ Sincronizando com seu banco...</span>';
        setTimeout(() => {
          checkBtn.disabled = false;
          checkBtn.style.opacity = '1';
          checkBtn.innerHTML = '<span class="tg-pulse-dot" style="background:#facc15;width:8px;height:8px;display:inline-block;border-radius:50%"></span> <span>⏳ Aguardando confirmação do banco...</span>';
        }, 5000);
      }
    }

    if (checkoutId) {
      try {
        const checkRes = await fetch(`/api/abacatepay?id=${checkoutId}`);
        if (checkRes.ok) {
          const statusData = await checkRes.json();
          if (statusData.isPaid) {
            trackPurchase(9.90, checkoutId);
            this.showPaidSuccess();
            return;
          }
        }
      } catch {}
    }

    this.addMessage('Já fiz o Pix, aguardando o banco confirmar... ⏳', 'out');
    await this.showTyping('consultando compensação...', 1800);

    this.addMessage(
      'tô monitorando aqui na hora! 💋\n\n' +
      'a API tá conectada direto com o banco... assim que a compensação cair, seu acesso VIP libera aqui automaticamente! ⏳\n\n' +
      '⚠️ <i>Se ainda não pagou ou prefere pagar pelo app com QR code aberto, toca no botão verde abaixo:</i>'
    );

    const pendingBox = document.createElement('div');
    pendingBox.className = 'tg-pix-pending-notice';
    pendingBox.style.cssText = 'background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.3);border-radius:14px;padding:12px;margin:8px 0;text-align:center';
    pendingBox.innerHTML = `
      <div style="font-size:13px;color:#facc15;font-weight:600;margin-bottom:8px">
        ⏳ Aguardando confirmação bancária do Pix
      </div>
      <a href="${planUrl}" target="_blank" rel="noopener" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:13.5px;padding:10px 16px;border-radius:10px;text-decoration:none;box-shadow:0 4px 14px rgba(34,197,94,0.3)">
        👉 Abrir / Concluir Pagamento Seguro (${planPriceStr}) ↗
      </a>
    `;
    this.messagesEl.appendChild(pendingBox);
    this.scrollToBottom();
  }

    // ----------------------------------------------------
    // UPSELL 1: APP EXCLUSIVO PRIVÉ COM ATUALIZAÇÕES
    // ----------------------------------------------------
    async showUpsell1App() {
      // Dispara Evento 9a: Upsell1_View
      trackUpsell1View(19.90);

      await this.showTyping('preparando proposta especial...', 2600);

      const upsellCard = document.createElement('div');
      upsellCard.className = 'tg-upsell-box';
      upsellCard.innerHTML = `
        <span class="tg-upsell-badge">📲 OPORTUNIDADE ÚNICA · 60% OFF</span>
        <h4 class="tg-upsell-title">App Exclusivo Carolzinha Privé</h4>
        <p class="tg-upsell-desc">
          Acesse minha biblioteca privada com galeria secreta, vídeos longos sem tarja e atualizações diárias direto no seu celular.
        </p>
        <div class="tg-upsell-price-wrap">
          <span class="tg-upsell-old-price">R$ 49,90</span>
          <span class="tg-upsell-price">R$ 19,90</span>
        </div>
        <button type="button" class="tg-upsell-accept-btn" id="tg-up1-accept">
          🔥 QUERO ADICIONAR O APP POR +R$ 19,90 🤤
        </button>
        <button type="button" class="tg-upsell-skip-btn" id="tg-up1-skip">
          Não quero, prefiro ficar só com o Telegram ↗
        </button>
      `;

      this.messagesEl.appendChild(upsellCard);
      this.scrollToBottom();

      upsellCard.querySelector('#tg-up1-accept').onclick = () => {
        upsellCard.remove();
        this.handleUpsell1Payment();
      };

      upsellCard.querySelector('#tg-up1-skip').onclick = () => {
        upsellCard.remove();
        this.showUpsell2Raffle();
      };
    }

    async handleUpsell1Payment() {
      this.addMessage('Quero adicionar o App Privé por R$ 19,90! 🔥', 'out');
      await this.showTyping('preparando ativação...', 2400);

      this.addMessage(
        'perfeito, gostoso! 📲🤤\n\n' +
        'sua vaga no <b>App Exclusivo Carolzinha Privé</b> tá reservada por apenas <b>+R$ 19,90</b>!\n\n' +
        'para vincular seu login de membro e receber a senha de acesso da biblioteca secreta, conclua a ativação no botão abaixo:'
      );

      const up1Box = document.createElement('div');
      up1Box.className = 'tg-checkout-card';
      up1Box.style.borderColor = '#e63973';
      up1Box.innerHTML = `
        <div class="tg-checkout-header">
          <span class="tg-checkout-badge">📲 Ativação VIP do App</span>
          <span class="tg-pix-timer">Taxa única: <strong>R$ 19,90</strong></span>
        </div>
        <p style="font-size:12.5px;color:#cbd5e1;margin:8px 0;line-height:1.4">
          Acesso liberado imediatamente no nosso bot oficial com login e senha da área de membros.
        </p>
        <a href="https://t.me/eucarolzinha_bot?start=upsell_app" target="_blank" rel="noopener" class="tg-pix-simulate-btn" id="tg-up1-real-btn" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:linear-gradient(135deg,#e63973,#c2185b);color:#fff;font-weight:800;font-size:14.5px;padding:12px;border-radius:12px;box-shadow:0 6px 20px rgba(230,57,115,0.35);margin:6px 0">
          🔥 Concluir Ativação do App no Telegram (+R$ 19,90) ↗
        </a>
        <button type="button" class="tg-upsell-skip-btn" id="tg-up1-continue-step" style="width:100%;background:none;border:none;color:#94a3b8;font-size:12px;cursor:pointer;padding:8px">
          Continuar para o próximo passo →
        </button>
      `;

      this.messagesEl.appendChild(up1Box);
      this.scrollToBottom();

      up1Box.querySelector('#tg-up1-real-btn').onclick = () => {
        trackUpsell1Purchase(19.90);
        setTimeout(() => this.showUpsell2Raffle(), 1500);
      };

      up1Box.querySelector('#tg-up1-continue-step').onclick = () => {
        up1Box.remove();
        this.showUpsell2Raffle();
      };
    }

  // ----------------------------------------------------
  // UPSELL 2: SORTEIO DA RIFA SECRETA
  // ----------------------------------------------------
  async showUpsell2Raffle() {
    // Dispara Evento 10a: Upsell2_View
    trackUpsell2View(9.90);

    await this.showTyping('digitando...', 2500);

    this.addMessage(
      'e tem mais uma surpresinha pra você... 👀🎁\n\n' +
      'todo mês eu faço um <b>SORTEIO VIP</b> exclusivo entre os membros ativos:'
    );

    const raffleCard = document.createElement('div');
    raffleCard.className = 'tg-upsell-box';
    raffleCard.style.borderColor = 'rgba(234, 179, 8, 0.5)';
    raffleCard.innerHTML = `
      <span class="tg-upsell-badge" style="background:rgba(234,179,8,0.2);color:#facc15;border-color:rgba(234,179,8,0.5)">
        🎟️ SORTEIO EXCLUSIVO DESTE MÊS
      </span>
      <h4 class="tg-upsell-title">Sorteio da Rifa Secreta VIP</h4>
      <p class="tg-upsell-desc" style="text-align:left;padding:0 8px">
        🏆 <b>1º Lugar:</b> Chamada de Vídeo íntima de 30min comigo ao vivo na cama.<br>
        🏆 <b>2º Lugar:</b> Minha calcinha usada favorita com meu perfume enviada discretamente para sua casa.
      </p>
      <div class="tg-upsell-price-wrap">
        <span class="tg-upsell-old-price">R$ 29,90</span>
        <span class="tg-upsell-price" style="color:#facc15">R$ 9,90</span> <small style="color:#94a3b8">/ cota</small>
      </div>
      <button type="button" class="tg-upsell-accept-btn" id="tg-up2-accept" style="background:linear-gradient(115deg,#ca8a04,#eab308);color:#000">
        🎟️ QUERO GARANTIR MINHA COTA POR R$ 9,90 😈
      </button>
      <button type="button" class="tg-upsell-skip-btn" id="tg-up2-skip">
        Ir direto para o meu acesso no Telegram ↗
      </button>
    `;

    this.messagesEl.appendChild(raffleCard);
    this.scrollToBottom();

    raffleCard.querySelector('#tg-up2-accept').onclick = () => {
      raffleCard.remove();
      this.handleUpsell2Payment();
    };

    raffleCard.querySelector('#tg-up2-skip').onclick = () => {
      raffleCard.remove();
      this.showFinalVipAccess();
    };
  }

  async handleUpsell2Payment() {
    this.addMessage('Quero minha cota do sorteio por R$ 9,90! 🎟️', 'out');
    await this.showTyping('gerando número da sorte...', 2500);

    const luckyNumber = Math.floor(100 + Math.random() * 900);
    this.addMessage(
      `🎟️ <b>COTA #${luckyNumber} PRÉ-RESERVADA!</b> 🥰🔥\n\n` +
      `para confirmar seu bilhete oficial da Rifa Secreta e concorrer à chamada de vídeo de 30min e à calcinha perfumada, toque no botão abaixo:`
    );

    const up2Box = document.createElement('div');
    up2Box.className = 'tg-checkout-card';
    up2Box.style.borderColor = '#eab308';
    up2Box.innerHTML = `
      <div class="tg-checkout-header">
        <span class="tg-checkout-badge" style="background:rgba(234,179,8,0.2);color:#facc15">🎟️ Bilhete da Sorte #${luckyNumber}</span>
        <span class="tg-pix-timer">Valor: <strong>R$ 9,90</strong></span>
      </div>
      <a href="https://t.me/eucarolzinha_bot?start=cota_${luckyNumber}" target="_blank" rel="noopener" class="tg-pix-simulate-btn" id="tg-up2-real-btn" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:linear-gradient(135deg,#eab308,#ca8a04);color:#000;font-weight:800;font-size:14.5px;padding:12px;border-radius:12px;box-shadow:0 6px 20px rgba(234,179,8,0.35);margin:6px 0">
        🎟️ Confirmar Cota #${luckyNumber} no Telegram (R$ 9,90) ↗
      </a>
      <button type="button" class="tg-upsell-skip-btn" id="tg-up2-continue-final" style="width:100%;background:none;border:none;color:#94a3b8;font-size:12px;cursor:pointer;padding:8px">
        Ir para o Canal VIP do Telegram →
      </button>
    `;

    this.messagesEl.appendChild(up2Box);
    this.scrollToBottom();

    up2Box.querySelector('#tg-up2-real-btn').onclick = () => {
      trackUpsell2Purchase(9.90);
      setTimeout(() => this.showFinalVipAccess(), 1500);
    };

    up2Box.querySelector('#tg-up2-continue-final').onclick = () => {
      up2Box.remove();
      this.showFinalVipAccess();
    };
  }

  // ----------------------------------------------------
  // ENTREGA FINAL: TELEGRAM VIP
  // ----------------------------------------------------
  async showFinalVipAccess() {
    await this.showTyping('gerando chave final...', 2600);

    this.addMessage(
      'prontinho! tudo preparado e sem nenhuma censura pra você... 😈🔥\n\n' +
      'agora sim... você tá 100% liberado! clica no botão abaixo pra entrar no nosso cantinho exclusivo no Telegram e curtir tudo sem censura 👇😈'
    );

    const vipCard = document.createElement('div');
    vipCard.className = 'tg-checkout-card';
    vipCard.style.borderColor = '#eab308';
    vipCard.innerHTML = `
      <div style="font-size:32px;margin-bottom:8px">🔑✨</div>
      <div style="font-size:18px;font-weight:800;color:#facc15;margin-bottom:6px">
        CANAL VIP LIBERADO!
      </div>
      <p style="font-size:13px;color:#d1d5db;margin:0 0 16px;line-height:1.4">
        Toque no botão abaixo para resgatar sua entrada no canal secreto e ver todos os vídeos e conteúdos exclusivos:
      </p>
      <a href="${TELEGRAM_DIRECT_URL}" target="_blank" rel="noopener" class="tg-checkout-btn-pay" id="tg-final-telegram-link" style="background:linear-gradient(135deg, #eab308, #ca8a04);color:#000;font-weight:800;font-size:15px;box-shadow:0 8px 25px rgba(234,179,8,0.4)">
        🔓 ENTRAR NO CANAL VIP NO TELEGRAM ↗
      </a>
    `;
    this.messagesEl.appendChild(vipCard);
    this.scrollToBottom();

    // Dispara Evento 11: CompleteRegistration no clique
    const linkBtn = vipCard.querySelector('#tg-final-telegram-link');
    if (linkBtn) {
      linkBtn.onclick = () => {
        trackCompleteRegistration('telegram_vip');
      };
    }

    this.setActions([
      {
        label: '🔓 ENTRAR NO CANAL VIP NO TELEGRAM 🤤',
        onClick: () => {
          trackCompleteRegistration('telegram_vip');
          window.open(TELEGRAM_DIRECT_URL, '_blank');
        }
      }
    ]);
  }
}

// Inicializador global
window.TelegramWebChat = TelegramWebChat;
