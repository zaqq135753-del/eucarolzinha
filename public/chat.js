// ======================================================
// TELEGRAM WEB CHAT - FLUXO NATIVO NA PRE-SELL
// ======================================================

import {
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

    this.messagesEl = document.getElementById('tg-messages');
    this.footerEl = document.getElementById('tg-action-footer');
    this.statusEl = document.getElementById('tg-user-status');

    const closeBtn = document.getElementById('tg-close-btn');
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
      trackChatOpened('presell_funnel');
      const params = new URLSearchParams(location.search);
      if (params.get('status') === 'approved' || params.get('paid') === '1' || params.get('demo_approved') === '1') {
        this.showPaidSuccess();
      } else if (this.state.step === 'start') {
        this.startFunnel();
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
      'seu acesso ao VIP já tá garantidinho amor! Mas antes de você entrar no Telegram, olha o que eu separei exclusivamente pra você:'
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
    await this.showTyping('digitando...', 1200);

    this.addMessage(
      'oii amor... tava aqui no tédio na cama pensando em você e não aguentei, tive que gravar isso agora... 👀🔥'
    );

    // Entrada: vídeo 3 toca por 3.5s e apaga
    await this.showTyping('enviando vídeo...', 1000);
    const wrongVideoMsg = this.addMessage('', 'in', { video: this.videos.video3.url });

    // Permite reproduzir por 3.5 segundos para atiçar a curiosidade
    await new Promise(r => setTimeout(r, 3500));

    // Apaga a mensagem na frente do lead
    this.deleteMessage(wrongVideoMsg, '🚫 Esta mensagem foi apagada por Carolzinha');

    await this.showTyping('digitando rápido...', 900);
    this.addMessage(
      'MEU DEUS AMOR APAGA ISSO KKKKKK 🙈🙈 socorro mandei no chat errado que vergonhaaaa\n\n' +
      'fala pra mim que você não viu pfv kkkkk 👀🔥 quase tive um treco aqui'
    );

    // INTERAÇÃO IMEDIATA: O lead escolhe como responder!
    this.setActions([
      {
        label: '😈 Eu vi tudinho amor, que delícia... 🔥',
        onClick: () => this.handleAfterDeletedChoice('😈 Eu vi tudinho amor, que delícia... 🔥')
      },
      {
        label: '🙈 Não vi nada vida, me manda de novo! 👀',
        onClick: () => this.handleAfterDeletedChoice('🙈 Não vi nada vida, me manda de novo! 👀')
      },
      {
        label: '🔥 Quero ir direto pro seu VIP (R$ 9,90) 🤤',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 Quero ir direto pro seu VIP (R$ 9,90) 🤤')
      }
    ]);
  }

  async handleAfterDeletedChoice(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1200);
    this.addMessage(
      'era pra te mandar esse aqui vida... mas promete de coração que não conta pra ninguém o que você viu?? 🙈🤤\n\n' +
      'olha esse aqui então... coloca o fone de ouvido aí e assiste com calma 👇👅💦'
    );

    // Envia o vídeo 1!
    await this.showTyping('enviando vídeo...', 1200);
    this.addMessage('', 'in', { video: this.videos.video1.url });
    trackPreview1(this.videos.video1.name);

    this.setActions([
      {
        label: '👀 me mostra mais amor, desce a mão 🔥',
        onClick: () => this.handleStep1Choice('👀 me mostra mais amor, desce a mão 🔥')
      },
      {
        label: '🔥 quero ir direto pro seu privado vida (R$ 9,90) 😈',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 quero ir direto pro seu privado vida (R$ 9,90) 😈')
      }
    ]);
  }

  async handleStep1Choice(userText) {
    trackPreview2Click(userText);
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1200);

    this.addMessage(
      'sabia que você ia pedir pra eu descer a mão haha... safadinho você né? 😂🔥\n\n' +
      'calma que nessa aqui eu já tava sem calcinha nenhuma e me deu um calor absurdo... olha a mão descendo devagarzinho aqui 👇🍑💦'
    );

    // Envia a prévia 3!
    await this.showTyping('enviando vídeo...', 1300);
    this.addMessage('', 'in', { video: this.videos.previa3.url });
    trackPreview2View(this.videos.previa3.name);

    await this.showTyping('digitando...', 1200);

    this.addMessage(
      'olha amor, eu gravei um bagulho bem mais íntimo aqui agorinha na cama... bem safado, nem devia te mandar agora pq fiquei com vergonha... 👀🙈\n\n' +
      'quer que eu te mande de presente agora?'
    );

    this.setActions([
      {
        label: '🎁 me manda esse presentinho agora amor 🤤',
        onClick: () => this.handleGiftStep('🎁 me manda esse presentinho agora amor 🤤')
      },
      {
        label: '🔥 quero ficar com você no vip agora vida 😈',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 quero ficar com você no vip agora vida 😈')
      }
    ]);
  }

  async handleGiftStep(userText) {
    trackGiftRequest(userText);
    this.addMessage(userText, 'out');
    await this.showTyping('gravando um presentinho...', 1300);

    this.addMessage(
      'amor, resolvi te soltar esse presentinho então... mas promete que não vai vazar pra ninguém hein? pelo amor de Deus kkkk 🙈🎁\n\n' +
      'gravei esse vídeo aqui bem íntimo só pra vc ver como eu fico quando tô pegando fogo na cama... 🤤💦\n\n' +
      'coloca o fone de ouvido aí no talo que o gemidinho tá baixo... assiste até o finalzinho 👇👅'
    );

    // Envia a prévia 2!
    await this.showTyping('enviando presente exclusivo...', 1300);
    this.addMessage('', 'in', { video: this.videos.previa2.url });
    trackGift(this.videos.previa2.name);

    await this.showTyping('digitando...', 1100);
    this.addMessage(
      'gostou do meu presentinho amor? 🤤💦 mó delícia gravar isso pra você...\n\n' +
      'imagina eu todinha pra você todo santo dia no meu cantinho particular, gemendo no seu ouvido e gravando tudo que você pedir sem censura nenhuma... 🔞🔥'
    );

    this.setActions([
      {
        label: '🔞 me mostra a última prévia antes do vip 🤤',
        onClick: () => this.handleLastPreviewStep('🔞 me mostra a última prévia antes do vip 🤤')
      },
      {
        label: '🔥 quero entrar no seu vip agora por R$ 9,90 🤤',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 quero entrar no seu vip agora por R$ 9,90 🤤')
      }
    ]);
  }

  async handleLastPreviewStep(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1100);

    this.addMessage(
      'nossa vida, se você já pirou naqueles, segura essa aqui... 🤤🔥\n\n' +
      'esse é o vídeo mais forte que eu já gravei fora do VIP! Olha como eu fico molhadinha de verdade quando penso em você 👇🔞💦'
    );

    // Envia a prévia 1!
    await this.showTyping('enviando vídeo mais forte...', 1300);
    this.addMessage('', 'in', { video: this.videos.previa1.url });

    await this.showTyping('digitando...', 1100);
    this.addMessage(
      'agora chega de passar vontade sozinho aqui amor... 🥵💦\n\n' +
      'lá no meu VIP eu tô sem calcinha te esperando na cama, com gemidinho no seu ouvido e gravando tudo que você pedir sem censura nenhuma!\n\n' +
      'escolhe seu plano aqui embaixo pra gente curtir no privado agora 👇💋'
    );

    this.setActions([
      {
        label: '🔥 escolher meu plano e entrar agora 🤤',
        onClick: () => this.handleDirectPlans('🔥 escolher meu plano e entrar agora 🤤')
      },
      {
        label: '👀 o que mais tem lá dentro amor? 😈',
        secondary: true,
        onClick: () => this.handleBenefits('👀 o que mais tem lá dentro amor? 😈')
      }
    ]);
  }

  async handleBenefits(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 3000);

    this.addMessage(
      'então vida, quando você destranca o acesso, você fica direto comigo aqui no meu chat pessoal, sem ninguém te vigiando... 🤫💋\n\n' +
      'lá eu me entrego 100% pra você todo santo dia:\n\n' +
      '🔥 <b>Vídeos sem censura nenhuma:</b> me masturbando todinha, usando brinquedinhos e chupando gostoso 🔞💦\n' +
      '📸 <b>Fotinhas no espelho:</b> bem de pertinho, sem calcinha, molhadinha só pra você 🍑🤤\n' +
      '🎥 <b>Gravações proibidas:</b> que o Instagram baniria em 5 segundos 😈\n' +
      '💬 <b>Conversa íntima no privado:</b> te mando áudio todo dia falando seu nome bem baixinho 🎧👅\n' +
      '✨ <b>Conteúdo novo diário:</b> pra você nunca mais dormir sozinho na vontade!\n\n' +
      '🔒 <b>100% DISCRETO E NO SIGILO:</b> No seu extrato bancário NÃO aparece nada adulto nem meu nome. Aparece apenas uma taxa discreta de tecnologia.\n\n' +
      '⚡ <b>LIBERAÇÃO INSTANTÂNEA:</b> Pagou no Pix, em 10 segundos já libera a chave do meu quarto pra gente curtir agora!\n\n' +
      'não vai me deixar na vontade aqui sozinha passando a mão né amor?'
    );

    this.setActions([
      {
        label: '🔥 escolher meu plano e entrar agora 🤤',
        onClick: () => this.handleDirectPlans('🔥 escolher meu plano e entrar agora 🤤')
      }
    ]);
  }

  async handleDirectPlans(userText) {
    this.state.step = 'plans';
    if (this.plansAbandonTimeout) clearTimeout(this.plansAbandonTimeout);

    if (userText) this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 2500);

    this.addMessage(
      '🔥 <b>tô te esperando na cama molhadinha vida...</b> 🥵💦\n\n' +
      'resolvi liberar meu cantinho completo pra você curtir comigo sem limite nenhum hoje! 👇😏\n\n' +
      '🔒 <i>100% no sigilo: no extrato do seu banco NÃO aparece nada adulto nem meu nome. Aparece apenas uma taxa neutra de tecnologia.</i>'
    );

    const plansCard = document.createElement('div');
    plansCard.className = 'tg-plans-card';
    plansCard.innerHTML = `
      <div class="tg-plan-item highlight" data-plan="7d" style="background:linear-gradient(135deg, rgba(230,57,115,0.2), #141b24);border:2px solid #e63973;box-shadow:0 8px 24px rgba(230,57,115,0.3);padding:16px">
        <div>
          <div class="tg-plan-badge" style="background:#e63973;color:#fff;font-weight:800;padding:4px 8px;border-radius:12px;font-size:11px">🔥 OFERTA ÚNICA EXCLUSIVA · LIBERAÇÃO IMEDIATA</div>
          <div class="tg-plan-title" style="font-size:17px;font-weight:800;margin-top:6px">Acesso VIP Completo + Privado 😈</div>
          <div class="tg-plan-sub" style="font-size:12px;color:#94a3b8;margin-top:2px"><del style="opacity:0.6">De R$ 79,90</del> · Todas as mídias sem censura + chat comigo</div>
        </div>
        <div class="tg-plan-price" style="font-size:22px;color:#4bd865;font-weight:900">R$ 9,90</div>
      </div>
    `;

    this.messagesEl.appendChild(plansCard);
    trackPlansView();
    this.scrollToBottom();

    plansCard.querySelectorAll('.tg-plan-item').forEach(el => {
      el.onclick = () => {
        if (this.plansAbandonTimeout) clearTimeout(this.plansAbandonTimeout);
        this.handlePlanSelected('7d');
      };
    });

    this.setActions([
      {
        label: '🔥 ENTRAR NO VIP COMPLETO POR R$ 9,90 🤤',
        onClick: () => {
          if (this.plansAbandonTimeout) clearTimeout(this.plansAbandonTimeout);
          this.handlePlanSelected('7d');
        }
      }
    ]);

    // ⏳ RESGATE ANTI-ABANDONO DA CAROLZINHA (25 SEGUNDOS)
    this.plansAbandonTimeout = setTimeout(async () => {
      if (this.state.step !== 'plans') return;
      await this.showTyping('digitando...', 2400);
      this.addMessage(
        'amor? você sumiu... ficou na dúvida? 🙈\n\n' +
        'olha, eu tô aqui na cama me tocando e não quero te deixar na vontade hoje... 🤤💦\n\n' +
        'é só <b>R$ 9,90 no Pix</b>, menos que um lanche, pra você me ter todinha sem censura no sigilo total! Clica abaixo e vem agora vida 👇'
      );
      this.setActions([
        {
          label: '🔥 Quero entrar agora por R$ 9,90 no Pix 🤤',
          onClick: () => this.handlePlanSelected('7d')
        }
      ]);
    }, 25000);
  }

  generateQrSvg() {
    // QR Code SVG nítido e responsivo simulando padrão Pix
    return `
      <svg class="tg-pix-qr-img" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <!-- Marcador Canto Sup Esq -->
        <rect x="5" y="5" width="26" height="26" fill="black" rx="4"/>
        <rect x="9" y="9" width="18" height="18" fill="white" rx="2"/>
        <rect x="13" y="13" width="10" height="10" fill="black" rx="1"/>
        <!-- Marcador Canto Sup Dir -->
        <rect x="69" y="5" width="26" height="26" fill="black" rx="4"/>
        <rect x="73" y="9" width="18" height="18" fill="white" rx="2"/>
        <rect x="77" y="13" width="10" height="10" fill="black" rx="1"/>
        <!-- Marcador Canto Inf Esq -->
        <rect x="5" y="69" width="26" height="26" fill="black" rx="4"/>
        <rect x="9" y="73" width="18" height="18" fill="white" rx="2"/>
        <rect x="13" y="77" width="10" height="10" fill="black" rx="1"/>
        <!-- Linhas e blocos centrais estilizados de QR Code -->
        <rect x="36" y="8" width="5" height="5" fill="black"/>
        <rect x="46" y="8" width="8" height="5" fill="black"/>
        <rect x="58" y="8" width="5" height="5" fill="black"/>
        <rect x="36" y="17" width="8" height="5" fill="black"/>
        <rect x="49" y="17" width="14" height="5" fill="black"/>
        <rect x="8" y="36" width="18" height="5" fill="black"/>
        <rect x="31" y="36" width="6" height="6" fill="black"/>
        <rect x="42" y="34" width="16" height="16" fill="black" rx="2"/>
        <rect x="63" y="36" width="12" height="5" fill="black"/>
        <rect x="80" y="36" width="12" height="5" fill="black"/>
        <rect x="8" y="46" width="5" height="8" fill="black"/>
        <rect x="18" y="46" width="14" height="8" fill="black"/>
        <rect x="68" y="46" width="6" height="10" fill="black"/>
        <rect x="78" y="46" width="14" height="6" fill="black"/>
        <rect x="8" y="58" width="22" height="5" fill="black"/>
        <rect x="36" y="58" width="10" height="6" fill="black"/>
        <rect x="52" y="58" width="18" height="5" fill="black"/>
        <rect x="75" y="58" width="17" height="6" fill="black"/>
        <rect x="36" y="69" width="14" height="6" fill="black"/>
        <rect x="55" y="69" width="10" height="6" fill="black"/>
        <rect x="70" y="69" width="12" height="6" fill="black"/>
        <rect x="87" y="69" width="5" height="6" fill="black"/>
        <rect x="36" y="80" width="8" height="12" fill="black"/>
        <rect x="49" y="84" width="18" height="8" fill="black"/>
        <rect x="72" y="80" width="8" height="12" fill="black"/>
        <rect x="85" y="80" width="7" height="12" fill="black"/>
      </svg>
    `;
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

  async handlePlanSelected(planKey) {
    if (this.plansAbandonTimeout) clearTimeout(this.plansAbandonTimeout);
    this.state.step = 'checkout';
    this.state.selectedPlan = planKey;
    const planNames = { '7d': 'Acesso VIP Completo (R$ 9,90)', '15d': '15 Dias (R$ 14,90)', '30d': '30 Dias (R$ 24,90)' };
    const planPrices = { '7d': 'R$ 9,90', '15d': 'R$ 14,90', '30d': 'R$ 24,90' };
    const planPricesNum = { '7d': 9.90, '15d': 14.90, '30d': 24.90 };
    let planUrl = CHECKOUT_PAY_URL;
    const visitorId = getVisitorId();

    // Dispara Evento 6: InitiateCheckout
    trackInitiateCheckout('7d', 9.90);

    this.addMessage(`Quero o ${planNames['7d']} 🔥`, 'out');
    await this.showTyping('gerando Pix oficial protegido no Banco Central...', 2200);

    // Geração dinâmica de Checkout Oficial via AbacatePay API
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
      console.warn('[Chat] Fallback para link de checkout direto:', e);
    }

    const realPixCode = `00020126580014br.gov.bcb.pix0136abacatepay-carol-${Date.now()}52040000530398654059.905802BR5916CAROLL SATLER6009SAO PAULO62070503***6304ABCD`;
    const realQrImgHtml = this.generateQrSvg();

    this.addMessage(
      'separei seu acesso exclusivo no sigilo total, amor! 🔑🔥\n\n' +
      '🔒 <i>pagamento 100% discreto no Pix (no extrato do seu banco aparece apenas uma taxa neutra de tecnologia, sem nada adulto).</i>\n\n' +
      'copia o código Pix abaixo e paga no seu banco que o sistema identifica e libera seu quarto na hora 👇🤤'
    );

    const checkoutCard = document.createElement('div');
    checkoutCard.className = 'tg-checkout-card';
    checkoutCard.innerHTML = `
      <div class="tg-checkout-header">
        <span class="tg-checkout-badge">⚡ Liberação Imediata • Vaga Exclusiva</span>
        <span class="tg-pix-timer">⏳ Garanta por <strong id="tg-pix-timer-count">10:00</strong></span>
      </div>

      <div class="tg-pix-value-tag" style="margin:10px 0 6px 0;background:rgba(230,57,115,0.12);border:1px solid rgba(230,57,115,0.3);padding:12px;border-radius:12px">
        <div style="font-size:12px;color:#94a3b8;font-weight:600">VALOR PROMOCIONAL ÚNICO</div>
        <div style="font-size:24px;font-weight:900;color:#4bd865">${planPrices[planKey]} <small style="font-size:13px;color:#cbd5e1;font-weight:500">(Acesso Completo + Privado)</small></div>
      </div>

      <!-- BOTÃO DE 1 CLIQUE DIRETO (MÁXIMA CONVERSÃO) -->
      <a href="${planUrl}" target="_blank" rel="noopener" class="tg-pix-simulate-btn" id="tg-real-pay" style="display:flex;align-items:center;justify-content:center;text-decoration:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:800;font-size:15px;padding:16px 18px;border-radius:14px;box-shadow:0 8px 26px rgba(34,197,94,0.45);margin:10px 0 12px 0;animation:tgPulseGreen 2s infinite">
        👉 PAGAR NO PIX OFICIAL (${planPrices[planKey]}) 🔒
      </a>

      <div style="font-size:12px;color:#94a3b8;text-align:center;margin-bottom:8px">
        — ou copie o código Pix abaixo para pagar no seu app —
      </div>

      <div class="tg-pix-copy-box">
        <input type="text" class="tg-pix-input" readonly value="${realPixCode}" id="tg-pix-code-field" />
        <button type="button" class="tg-pix-copy-btn" id="tg-pix-copy-action">
          📋 Copiar Pix
        </button>
      </div>

      <!-- Atalhos Rápidos para Abrir o Banco do Usuário -->
      <div class="tg-bank-shortcuts">
        <div class="tg-bank-shortcuts-title">
          <span>🚀 Pagar Rápido: Escolha seu Banco</span>
        </div>
        <div class="tg-bank-shortcuts-grid">
          <button type="button" class="tg-bank-btn nubank" data-scheme="nubank://" data-store="https://play.google.com/store/apps/details?id=com.nu.production" title="Abrir Nubank">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#820ad1"><path d="M14.8 5.5c-2.3 0-4.1 1.6-4.6 3.7h-.2V5.8H5.8v12.4h4.2v-6.3c0-1.7 1.2-3 2.8-3 1.6 0 2.8 1.3 2.8 3v6.3h4.2v-6.9c0-3.2-2.3-5.8-5-5.8z"/></svg>
            </span>
            <span>Nubank</span>
          </button>
          <button type="button" class="tg-bank-btn inter" data-scheme="bancointer://" data-store="https://play.google.com/store/apps/details?id=br.com.intermedium" title="Abrir Inter">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff7a00"><circle cx="12" cy="12" r="10" fill="#ff7a00"/><path d="M12 6.5v11M8.5 12h7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
            </span>
            <span>Inter</span>
          </button>
          <button type="button" class="tg-bank-btn mercadopago" data-scheme="mercadopago://" data-store="https://play.google.com/store/apps/details?id=com.mercadopago.wallet" title="Abrir Mercado Pago">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#009ee3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07c-2.02-.34-3.5-1.92-3.5-3.93 0-1.74 1.15-3.08 2.88-3.57l1.62-.47c.94-.27 1.5-.78 1.5-1.46 0-.83-.67-1.5-1.5-1.5-.88 0-1.55.67-1.55 1.55H8.45c0-1.84 1.36-3.36 3.55-3.53V3h2v1.07c2.02.34 3.5 1.92 3.5 3.93 0 1.74-1.15 3.08-2.88 3.57l-1.62.47c-.94.27-1.5.78-1.5 1.46 0 .83.67 1.5 1.5 1.5.88 0 1.55-.67 1.55-1.55h2c0 1.84-1.36 3.36-3.55 3.53z"/></svg>
            </span>
            <span>Mercado Pago</span>
          </button>
          <button type="button" class="tg-bank-btn picpay" data-scheme="picpay://" data-store="https://play.google.com/store/apps/details?id=com.picpay" title="Abrir PicPay">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#21c25e"><rect x="3" y="3" width="18" height="18" rx="5" fill="#21c25e"/><path d="M9 16V8h4.5c1.93 0 3.5 1.34 3.5 3s-1.57 3-3.5 3H11v2H9z" fill="#fff"/></svg>
            </span>
            <span>PicPay</span>
          </button>
          <button type="button" class="tg-bank-btn itau" data-scheme="itau://" data-store="https://play.google.com/store/apps/details?id=com.itau" title="Abrir Itaú">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#ec7000"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ec7000"/><text x="12" y="16" fill="#fff" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">itau</text></svg>
            </span>
            <span>Itaú</span>
          </button>
          <button type="button" class="tg-bank-btn caixa" data-scheme="caixa://" data-store="https://play.google.com/store/apps/details?id=br.gov.caixa.tem" title="Abrir Caixa">
            <span class="tg-bank-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#005ca9"><rect x="3" y="3" width="18" height="18" rx="4" fill="#005ca9"/><path d="M7 8l5 4-5 4M12 8l5 4-5 4" stroke="#ff7a00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span>Caixa</span>
          </button>
        </div>
      </div>

      <div class="tg-pix-status-bar" style="margin-top:10px">
        <span class="tg-pulse-dot" id="tg-status-dot"></span>
        <span id="tg-status-text">Aguardando compensação bancária...</span>
      </div>

      <button type="button" class="tg-pix-check-action-btn" id="tg-check-pay" style="width:100%;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.35);color:#facc15;padding:12px;border-radius:12px;font-size:13.5px;font-weight:700;cursor:pointer;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s">
        <span class="tg-pulse-dot" style="background:#facc15;width:8px;height:8px;display:inline-block;border-radius:50%"></span>
        <span>⏳ Aguardando confirmação do banco...</span>
      </button>
    `;

    this.messagesEl.appendChild(checkoutCard);
    this.scrollToBottom();
    this.startPixTimer(checkoutCard);

    // Ação de copiar código Pix (Evento 7: PixCodeCopied)
    const copyBtn = checkoutCard.querySelector('#tg-pix-copy-action');
    const inputField = checkoutCard.querySelector('#tg-pix-code-field');
    const doCopyPix = (notify = true) => {
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(realPixCode).catch(() => {});
          copied = true;
        }
      } catch (err) {}

      // Fallback robusto garantido para WebViews de TikTok/Instagram e mobile antigo
      try {
        inputField.focus();
        inputField.select();
        inputField.setSelectionRange(0, 99999);
        const successful = document.execCommand('copy');
        if (successful) copied = true;
      } catch (err) {}

      trackPixCopied(planPricesNum[planKey] || 14.90);
      if (notify) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '✅ Pix Copiado! Cola no Banco';
        copyBtn.style.background = '#059669';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '📋 Copiar Código Pix';
          copyBtn.style.background = '';
        }, 4000);
      }
      return copied;
    };

    copyBtn.onclick = () => doCopyPix(true);
    inputField.onclick = () => doCopyPix(true);

    // Configuração dos Botões de Abertura Direta dos Bancos (Deep Links)
    checkoutCard.querySelectorAll('.tg-bank-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        // 1. Garante a cópia do código Pix no mesmo milissegundo
        doCopyPix(true);

        const scheme = btn.dataset.scheme;
        const store = btn.dataset.store;

        // Feedback no botão de status
        const statusText = checkoutCard.querySelector('#tg-status-text');
        if (statusText) statusText.textContent = 'Pix copiado! Abrindo aplicativo do banco...';

        // 2. Dispara tentativa de abrir o aplicativo do banco
        const now = Date.now();
        window.location.href = scheme;

        // Fallback: se o app não estiver instalado após 1.5s, não trava a tela
        setTimeout(() => {
          if (Date.now() - now < 2000 && !document.hidden) {
            // Continua no chat com o código copiado pronto
            if (statusText) statusText.textContent = 'Código copiado! Cole na opção "Pix Copia e Cola" do seu banco.';
          }
        }, 1500);
      };
    });

    // Ação do botão principal de checkout
    const realPayBtn = checkoutCard.querySelector('#tg-real-pay');
    realPayBtn.onclick = () => {
      trackPushinPayClick(planKey, planPricesNum[planKey] || 9.90);
      trackInitiateCheckout(planKey, planPricesNum[planKey] || 9.90);
    };

    // Ação de checar pagamento
    const checkBtn = checkoutCard.querySelector('#tg-check-pay');
    checkBtn.onclick = () => {
      trackPaymentCheckRequested(planKey);
      this.handlePaymentCheck(checkoutCard, planUrl, planPrices[planKey], checkoutData?.checkoutId);
    };

    // Auto-polling automático de confirmação Pix em tempo real
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
              trackPurchase(planPricesNum[planKey] || 9.90, checkoutData.checkoutId);
              this.showPaidSuccess();
            }
          }
        } catch {}
      }, 3500);
    }
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

    this.addMessage('Já fiz o Pix, aguardando o banco confirmar amor... ⏳', 'out');
    await this.showTyping('consultando compensação...', 2800);

    this.addMessage(
      'tô monitorando aqui na hora, amor! 💋\n\n' +
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
        'perfeito, amor! 📲🤤\n\n' +
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
      'e tem mais um detalhe especial amor... 👀🎁\n\n' +
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
      'prontinho, amor! tudo preparado com muito carinho 🥰🔥\n\n' +
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
