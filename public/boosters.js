// ======================================================
// CONVERSION BOOSTERS - CAROLZINHA PRIVÉ
// Notificação Topo, Prova Social, Exit-Intent & Back Redirect
// ======================================================

import { trackChatOpened } from './tracking.js';

const TELEGRAM_VIP_URL = 'https://t.me/eucarolzinha_bot?start=site_vip';

export function setupBoosters(chatInstance) {
  let exitShown = false;

  // ----------------------------------------------------
  // 1. NOTIFICAÇÃO SUSPENSA FAKE DO TELEGRAM NO TOPO
  // ----------------------------------------------------
  function createTopPush() {
    const banner = document.createElement('div');
    banner.className = 'tg-push-banner';
    banner.id = 'tg-push-banner';
    banner.innerHTML = `
      <div class="tg-push-avatar-wrap">
        <img src="/assets/carol-avatar.jpg" alt="Carolzinha" class="tg-push-avatar" />
        <span class="tg-push-icon-badge">💬</span>
      </div>
      <div class="tg-push-content">
        <div class="tg-push-header">
          <span class="tg-push-title">Carolzinha Satler <span style="color:#2ea5ff;font-size:11px">✓</span></span>
          <span class="tg-push-time">agora</span>
        </div>
        <div class="tg-push-text">amor, você ainda tá aí? acabei de gravar um presentinho só pra você... 👀🎁</div>
      </div>
      <button type="button" class="tg-push-close" id="tg-push-close" aria-label="Fechar">✕</button>
    `;

    document.body.appendChild(banner);

    // Dispara suavemente após 10 segundos de navegação SOMENTE se o chat não estiver aberto
    setTimeout(() => {
      const isChatPage = window.location.pathname.includes('/chat') || window.location.search.includes('chat=1');
      const isChatOpen = chatInstance && typeof chatInstance.isOpen === 'function' && chatInstance.isOpen();
      if (!exitShown && !isChatOpen && !isChatPage) {
        banner.classList.add('active');
      }
    }, 10000);

    banner.onclick = (e) => {
      if (e.target.id === 'tg-push-close') {
        e.stopPropagation();
        banner.classList.remove('active');
        return;
      }
      banner.classList.remove('active');
      if (chatInstance) {
        trackChatOpened('fake_push');
        chatInstance.open();
      }
    };
  }

  // ----------------------------------------------------
  // 2. PROVA SOCIAL AO VIVO (TOASTS DE COMPRA PIX)
  // ----------------------------------------------------
  function createSocialProof() {
    const toast = document.createElement('div');
    toast.className = 'tg-social-toast';
    toast.id = 'tg-social-toast';
    document.body.appendChild(toast);

    const events = [
      { user: 'Lucas M.', plan: 'Liberou o VIP de 15 Dias', icon: '🔥', time: 'há 2 minutos' },
      { user: 'Matheus R.', plan: 'Liberou o VIP Completo', icon: '⚡', time: 'há 4 minutos' },
      { user: 'Rodrigo S.', plan: 'Acesso VIP confirmado via Pix', icon: '✅', time: 'há 6 minutos' },
      { user: 'Gabriel C.', plan: 'Entrou no canal privado', icon: '🍑', time: 'há 8 minutos' },
      { user: 'Thiago F.', plan: 'Garantiu 30 dias de VIP', icon: '👑', time: 'há 11 minutos' }
    ];

    let index = 0;
    function showNextToast() {
      const item = events[index % events.length];
      index++;

      toast.innerHTML = `
        <span class="tg-social-icon">${item.icon}</span>
        <div class="tg-social-info">
          <span class="tg-social-user">${item.user}</span>
          <span class="tg-social-plan">${item.plan}</span>
          <span class="tg-social-time">${item.time}</span>
        </div>
      `;

      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 5000);
    }

    // Primeiro toast aos 12 segundos, depois a cada 22 segundos
    setTimeout(() => {
      showNextToast();
      setInterval(showNextToast, 22000);
    }, 12000);
  }

  // ----------------------------------------------------
  // 3. POPUP DE SAÍDA COM DOWNSELL DE EMERGÊNCIA
  // ----------------------------------------------------
  function createExitIntent() {
    const overlay = document.createElement('div');
    overlay.className = 'tg-exit-overlay';
    overlay.id = 'tg-exit-overlay';
    overlay.innerHTML = `
      <div class="tg-exit-modal">
        <button class="tg-exit-close-btn" id="tg-exit-close">✕</button>
        <img src="/assets/carol-avatar.jpg" alt="Carolzinha" class="tg-exit-avatar" />
        <span class="tg-exit-badge">⚠️ CONDIÇÃO SECRETA DE EMERGÊNCIA</span>
        <h3 class="tg-exit-title">Espera amor... não vai embora na vontade! 🥺💔</h3>
        <p class="tg-exit-desc">
          Vi que você ficou em dúvida, então liberei essa condição exclusiva só para você não ficar chupando o dedo hoje:
        </p>
        <div class="tg-exit-offer-box">
          <div class="tg-exit-offer-plan">🔥 7 Dias de Acesso Privado</div>
          <div class="tg-exit-offer-price">R$ 7,90 <span style="font-size:14px;color:#94a3b8">no Pix</span></div>
          <div class="tg-exit-offer-note">Menos que um cafézinho pra me ter pelada na sua cama!</div>
        </div>
        <button type="button" class="tg-exit-cta-btn" id="tg-exit-accept">
          🔥 QUERO ENTRAR POR R$ 7,90 AGORA 🤤
        </button>
        <button type="button" class="tg-exit-dismiss-link" id="tg-exit-dismiss">
          Não quero, prefiro dormir na vontade...
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    function openExitModal() {
      if (exitShown) return;
      exitShown = true;
      overlay.classList.add('active');
    }

    function closeExitModal() {
      overlay.classList.remove('active');
    }

    // Gatilho Desktop: mouse saindo pelo topo da janela
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown) {
        openExitModal();
      }
    });

    // Gatilho Mobile: Interceptação do botão Voltar (Back-Redirect)
    try {
      history.pushState({ page: 'presell-init' }, '', location.href);
      window.addEventListener('popstate', () => {
        if (!exitShown) {
          openExitModal();
          history.pushState(null, '', location.href);
        }
      });
    } catch {}

    overlay.querySelector('#tg-exit-close').onclick = closeExitModal;
    overlay.querySelector('#tg-exit-dismiss').onclick = closeExitModal;

    overlay.querySelector('#tg-exit-accept').onclick = () => {
      closeExitModal();
      if (chatInstance) {
        trackChatOpened('fake_push');
        chatInstance.open();
        // Direciona direto para o plano de 7 dias com o desconto
        chatInstance.handlePlanSelected('7d');
      }
    };
  }

  createTopPush();
  createSocialProof();
  createExitIntent();
}
