// ======================================================
// TELEGRAM WEB CHAT - FLUXO NATIVO NA PRE-SELL
// ======================================================

const PUSHINPAY_LINKS = {
  '7d': 'https://app.pushinpay.com.br/service/pay/A2EDB903-5026-4F10-9C19-2ED96008CA38',
  '15d': 'https://app.pushinpay.com.br/service/pay/A2E6EB06-7D4A-4E80-9B8C-A571478CEF8D',
  '30d': 'https://app.pushinpay.com.br/service/pay/A2E6EAD8-46C8-4B94-99A6-E5AC93BA9B1C'
};

const TELEGRAM_DIRECT_URL = 'https://t.me/eucarolzinha_bot?start=site';

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
              <div class="tg-user-status" id="tg-user-status">online</div>
            </div>
            <div class="tg-header-actions">
              <a href="${TELEGRAM_DIRECT_URL}" target="_blank" rel="noopener" class="tg-app-switch" title="Abrir no app do Telegram">
                Abrir App ↗
              </a>
            </div>
          </header>

          <!-- Mensagens -->
          <main class="tg-messages" id="tg-messages"></main>

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
      this.target.appendChild(div.firstChild);
      this.overlay = document.getElementById('tg-chat-overlay');
      this.container = this.overlay.querySelector('.tg-chat-container');
    } else {
      this.target.innerHTML = html.trim();
      this.overlay = this.target.querySelector('.tg-modal-overlay');
      this.overlay.classList.add('active');
      this.overlay.style.position = 'relative';
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

  open() {
    if (this.overlay) {
      this.overlay.classList.add('active');
      if (this.state.step === 'start') {
        this.startFunnel();
      }
    }
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

  showTyping(label = 'digitando...', duration = 1200) {
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
          <video class="tg-video" src="${extra.video}" playsinline webkit-playsinline loop preload="auto"></video>
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

  async startFunnel() {
    this.state.step = 'intro';
    await this.showTyping('digitando...', 900);

    this.addMessage(
      'oi amor... tava aqui sem sono pensando em você e não aguentei, tive que gravar isso agora... 👀🔥\n\n' +
      'eu não costumo mandar nada assim logo de cara, mas senti uma vibe tão gostosa com você... 🙈🤤\n\n' +
      'coloca o fone de ouvido aí rapidinho e me assiste com atenção... garanto que você não vai conseguir tirar o olho 👅💦'
    );

    await this.showTyping('enviando vídeo...', 1100);
    this.addMessage('', 'in', { video: '/assets/previa-1.mp4' });

    this.setActions([
      {
        label: '👀 me mostra agora amor 🔥',
        onClick: () => this.handleStep1Choice('👀 me mostra agora amor 🔥')
      },
      {
        label: '🔥 quero entrar no seu privado agora 😈',
        secondary: true,
        onClick: () => this.handleDirectPlans('🔥 quero entrar no seu privado agora 😈')
      }
    ]);
  }

  async handleStep1Choice(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 900);

    this.addMessage(
      'eu sabia que você ia pedir pra eu descer a mão haha... safadinho você né? 😂🔥\n\n' +
      'calma que essa próxima eu já tava sem calcinha nenhuma e não me aguentei... olha esse olhar aqui 👇🍑💦'
    );

    await this.showTyping('enviando vídeo...', 1300);
    this.addMessage('', 'in', { video: '/assets/previa-2.mp4' });

    // --- A MECÂNICA DO PRESENTINHO SECRETO ---
    await this.showTyping('gravando um presentinho...', 1500);

    this.addMessage(
      'amor, resolvi te dar um presentinho antes da gente continuar... 👀🎁\n\n' +
      'gravei esse vídeo aqui bem íntimo só pra vc ver como eu fico quando tô com tesão na cama... 🤤💦\n\n' +
      'prepara o fone de ouvido aí e assiste com calma 👇👅'
    );

    await this.showTyping('enviando presente...', 1200);
    this.addMessage('', 'in', { video: '/assets/previa-3.mp4' });

    await this.showTyping('digitando...', 800);
    this.addMessage(
      'gostou do meu presentinho amor? 🤤💦\n\n' +
      'imagina eu todinha pra você todo santo dia no meu cantinho particular, gemendo no seu ouvido e gravando tudo que você pedir sem censura nenhuma... 🔞🔥'
    );

    this.setActions([
      {
        label: '🔥 quero entrar no seu vip agora 🤤',
        onClick: () => this.handleDirectPlans('🔥 quero entrar no seu vip agora 🤤')
      },
      {
        label: '👀 o que tem lá dentro amor? 😈',
        secondary: true,
        onClick: () => this.handleBenefits('👀 o que tem lá dentro amor? 😈')
      }
    ]);
  }

  async handleBenefits(userText) {
    this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 1200);

    this.addMessage(
      'então amor, quando você destranca o acesso, você fica direto comigo aqui no meu chat pessoal, sem ninguém te vigiando... 🤫💋\n\n' +
      'lá eu me entrego 100% pra você:\n\n' +
      '🔥 <b>Vídeos sem censura nenhuma:</b> me masturbando, usando brinquedinhos e chupando bem gostoso 🔞💦\n' +
      '📸 <b>Fotinhas no espelho:</b> bem de pertinho, sem calcinha, molhadinha só pra você 🍑🤤\n' +
      '🎥 <b>Gravações proibidas:</b> que o Instagram baniria em 5 segundos 😈\n' +
      '💬 <b>Conversa íntima no privado:</b> te mando áudio gemendo seu nome todo dia 🎧👅\n' +
      '✨ <b>Conteúdo novo diário:</b> pra você nunca mais dormir sozinho na vontade!\n\n' +
      '🔒 <b>100% DISCRETO E SEGURO:</b> Na sua fatura ou extrato bancário NÃO aparece nada adulto nem meu nome. Aparece apenas uma taxa discreta de tecnologia.\n\n' +
      '⚡ <b>LIBERAÇÃO INSTANTÂNEA:</b> Pagou no Pix, em 10 segundos já libera a chave do meu quarto pra gente curtir agora!\n\n' +
      'vamos matar essa vontade agora amor?'
    );

    this.setActions([
      {
        label: '🔥 escolher meu plano e entrar agora 🤤',
        onClick: () => this.handleDirectPlans('🔥 escolher meu plano e entrar agora 🤤')
      }
    ]);
  }

  async handleDirectPlans(userText) {
    if (userText) this.addMessage(userText, 'out');
    await this.showTyping('digitando...', 900);

    this.addMessage(
      '🔥 <b>tô te esperando na cama molhadinha amor...</b> 🥵💦\n\n' +
      'não vai me deixar na vontade aqui sozinha passando a mão né? escolhe quanto tempo você quer ficar comigo 👇😏'
    );

    const plansCard = document.createElement('div');
    plansCard.className = 'tg-plans-card';
    plansCard.innerHTML = `
      <div class="tg-plan-item highlight" data-plan="15d">
        <div>
          <div class="tg-plan-badge">⭐ O QUE EU MAIS AMO (MEU FAVORITO)</div>
          <div class="tg-plan-title">15 Dias de Acesso 🔥</div>
          <div class="tg-plan-sub">Menos de R$ 1 por dia!</div>
        </div>
        <div class="tg-plan-price">R$ 14,90</div>
      </div>

      <div class="tg-plan-item" data-plan="7d">
        <div>
          <div class="tg-plan-badge">👀 PROVA RÁPIDA</div>
          <div class="tg-plan-title">7 Dias de Acesso 😈</div>
          <div class="tg-plan-sub">Uma provinha de uma semana</div>
        </div>
        <div class="tg-plan-price">R$ 8,90</div>
      </div>

      <div class="tg-plan-item" data-plan="30d">
        <div>
          <div class="tg-plan-badge">👑 VIP TOTAL</div>
          <div class="tg-plan-title">30 Dias de Acesso 🍑</div>
          <div class="tg-plan-sub">Intimidade máxima no privado</div>
        </div>
        <div class="tg-plan-price">R$ 24,90</div>
      </div>
    `;

    this.messagesEl.appendChild(plansCard);
    this.scrollToBottom();

    plansCard.querySelectorAll('.tg-plan-item').forEach(el => {
      el.onclick = () => {
        const plan = el.dataset.plan;
        this.handlePlanSelected(plan);
      };
    });
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
    this.state.selectedPlan = planKey;
    const planNames = { '7d': '7 Dias (R$ 8,90)', '15d': '15 Dias (R$ 14,90)', '30d': '30 Dias (R$ 24,90)' };
    const planPrices = { '7d': 'R$ 8,90', '15d': 'R$ 14,90', '30d': 'R$ 24,90' };
    const planUrl = PUSHINPAY_LINKS[planKey];

    this.addMessage(`Quero o plano de ${planNames[planKey]} 🔥`, 'out');
    await this.showTyping('gerando Pix exclusivo...', 1000);

    this.addMessage(
      'separei seu acesso exclusivo, amor! 🔑🔥\n\n' +
      '🔒 <i>pagamento 100% discreto e sigiloso no Pix (não aparece nada de conteúdo no seu comprovante bancário).</i>\n\n' +
      'copia o código Pix ou escaneia o QR Code abaixo que o sistema já identifica na hora 👇🤤'
    );

    // Código Pix simulado autêntico
    const pixCode = `00020126580014br.gov.bcb.pix0136${planKey}-carolzinha-${Date.now()}5204000053039865405${planKey === '7d' ? '8.90' : planKey === '15d' ? '14.90' : '24.90'}5802BR5916CAROLZINHA PRIVE6009SAO PAULO62070503***6304ABCD`;

    const checkoutCard = document.createElement('div');
    checkoutCard.className = 'tg-checkout-card';
    checkoutCard.innerHTML = `
      <div class="tg-checkout-header">
        <span class="tg-checkout-badge">🔒 Pix Oficial Protegido</span>
        <span class="tg-pix-timer">⏳ Expira em <strong id="tg-pix-timer-count">10:00</strong></span>
      </div>

      <div class="tg-pix-qr-container">
        ${this.generateQrSvg()}
      </div>

      <div class="tg-pix-value-tag">
        ${planPrices[planKey]} <small>(${planNames[planKey]})</small>
      </div>

      <div class="tg-pix-copy-box">
        <input type="text" class="tg-pix-input" readonly value="${pixCode}" id="tg-pix-code-field" />
        <button type="button" class="tg-pix-copy-btn" id="tg-pix-copy-action">
          📋 Copiar Pix
        </button>
      </div>

      <div class="tg-pix-status-bar">
        <span class="tg-pulse-dot" id="tg-status-dot"></span>
        <span id="tg-status-text">Aguardando confirmação bancária...</span>
      </div>

      <button type="button" class="tg-pix-simulate-btn" id="tg-simulate-pay">
        ⚡ Já paguei no banco (Confirmar Pix) ✅
      </button>

      <a href="${planUrl}" target="_blank" rel="noopener" class="tg-pix-real-link">
        Ou abrir checkout oficial da Pushin Pay ↗
      </a>
    `;

    this.messagesEl.appendChild(checkoutCard);
    this.scrollToBottom();
    this.startPixTimer(checkoutCard);

    // Ação de copiar código Pix
    const copyBtn = checkoutCard.querySelector('#tg-pix-copy-action');
    const inputField = checkoutCard.querySelector('#tg-pix-code-field');
    copyBtn.onclick = () => {
      inputField.select();
      navigator.clipboard?.writeText(pixCode).catch(() => {});
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '✓ Copiado!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '📋 Copiar Pix';
      }, 3500);
    };

    // Ação de confirmar / simular pagamento
    const simulateBtn = checkoutCard.querySelector('#tg-simulate-pay');
    simulateBtn.onclick = () => {
      this.handlePaidConfirmation(checkoutCard);
    };
  }

  async handlePaidConfirmation(checkoutCard) {
    if (this.pixTimerInterval) clearInterval(this.pixTimerInterval);

    // Atualiza status do card para identificando
    if (checkoutCard) {
      const statusText = checkoutCard.querySelector('#tg-status-text');
      const dot = checkoutCard.querySelector('#tg-status-dot');
      if (statusText) statusText.textContent = 'Identificando transação Pix no banco...';
      if (dot) dot.classList.add('success');
      const simBtn = checkoutCard.querySelector('#tg-simulate-pay');
      if (simBtn) {
        simBtn.disabled = true;
        simBtn.style.opacity = '0.7';
        simBtn.textContent = '⏳ Conferindo transação...';
      }
    }

    this.addMessage('Já paguei o Pix, me libera amor! ✅', 'out');
    await this.showTyping('verificando na Pushin Pay...', 1400);

    this.addMessage(
      'recebi seu aviso aqui, amor! 💋\n\n' +
      'o sistema tá só validando o comprovante da transação... aguenta 3 segundinhos que já libero a chave do quarto! ⏳🔥'
    );

    // Simulação da aprovação do webhook da Pushin Pay
    setTimeout(async () => {
      if (checkoutCard) {
        const statusText = checkoutCard.querySelector('#tg-status-text');
        if (statusText) statusText.textContent = '✅ Pagamento confirmado via Pix!';
      }

      await this.showTyping('liberando VIP...', 1100);
      this.addMessage(
        '🎉 <b>PAGAMENTO APROVADO COM SUCESSO!</b> 🥰🔥\n\n' +
        'amor, seu acesso VIP tá 100% liberadinho agora mesmo! clica no botão abaixo pra entrar no nosso cantinho exclusivo no Telegram e curtir tudo sem censura 👇😈'
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
        <a href="${TELEGRAM_DIRECT_URL}" target="_blank" rel="noopener" class="tg-checkout-btn-pay" style="background:linear-gradient(135deg, #eab308, #ca8a04);color:#000;font-weight:800;font-size:15px;box-shadow:0 8px 25px rgba(234,179,8,0.4)">
          🔓 ENTRAR NO CANAL VIP NO TELEGRAM ↗
        </a>
      `;
      this.messagesEl.appendChild(vipCard);
      this.scrollToBottom();

      this.setActions([
        {
          label: '🔓 ENTRAR NO CANAL VIP NO TELEGRAM 🤤',
          onClick: () => {
            window.open(TELEGRAM_DIRECT_URL, '_blank');
          }
        }
      ]);
    }, 2800);
  }
}

// Inicializador global
window.TelegramWebChat = TelegramWebChat;
