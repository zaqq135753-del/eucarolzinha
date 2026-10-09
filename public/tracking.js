// ======================================================
// TRACKING & PIXEL ENGINE - CAROLZINHA PRIVÉ
// Meta Pixel (Facebook Ads), TikTok Pixel, GA4 & Backend Funnel
// ======================================================

export const attributionKeys = [
  'utm_source',
  'utm_campaign',
  'utm_medium',
  'utm_content',
  'utm_term',
  'fbclid',
  'ttclid',
  'gclid'
];

export function captureAttribution(search) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(
    attributionKeys.filter(k => params.has(k)).map(k => [k, params.get(k)])
  );
}

// Session-only attribution
export function sessionAttribution(search, storage) {
  let previous = {};
  try {
    previous = JSON.parse(storage.getItem('presell_attribution') || '{}');
  } catch {}
  const current = captureAttribution(search);
  const result = Object.keys(current).length
    ? current
    : Object.fromEntries(
        attributionKeys
          .filter(k => typeof previous?.[k] === 'string')
          .map(k => [k, previous[k]])
      );
  try {
    storage.setItem('presell_attribution', JSON.stringify(result));
  } catch {}
  return result;
}

// Persistent Visitor ID
export function getVisitorId() {
  const key = 'carol_visitor_id';
  try {
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(key, vid);
    }
    return vid;
  } catch {
    return `usr_${Date.now().toString(36)}`;
  }
}

// Backend API URL
const BACKEND_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://telegram-vip-funnel.onrender.com';

// State
let isInitialized = false;
let pixelConfig = {
  metaPixelId: '',
  tiktokPixelId: '',
  googleAnalyticsId: ''
};

// ------------------------------------------------------
// INJEÇÃO AUTOMÁTICA DOS SDKS (META PIXEL & TIKTOK PIXEL)
// ------------------------------------------------------

function injectMetaPixel(pixelId) {
  if (!pixelId || window.fbq) return;
  try {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', pixelId);
    console.log(`[Pixel] Meta Pixel inicializado: ${pixelId}`);
  } catch (err) {
    console.warn('[Pixel] Erro ao injetar Meta Pixel:', err);
  }
}

function injectTikTokPixel(pixelId) {
  if (!pixelId || window.ttq) return;
  try {
    /* eslint-disable */
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie'
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = i),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement('script');
          (o.type = 'text/javascript'), (o.async = !0), (o.src = i + '?sdkid=' + e + '&lib=' + t);
          var a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(o, a);
        });
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
    /* eslint-enable */

    console.log(`[Pixel] TikTok Pixel inicializado: ${pixelId}`);
  } catch (err) {
    console.warn('[Pixel] Erro ao injetar TikTok Pixel:', err);
  }
}

// Busca configurações do servidor
export async function initPixelTracking() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    const res = await fetch(`${BACKEND_URL}/api/pixel-config`, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data?.config) {
        pixelConfig = data.config;
        if (pixelConfig.metaPixelId) injectMetaPixel(pixelConfig.metaPixelId);
        if (pixelConfig.tiktokPixelId) injectTikTokPixel(pixelConfig.tiktokPixelId);

        // Injeta custom scripts se houver
        if (pixelConfig.customTrackingCode) {
          const div = document.createElement('div');
          div.innerHTML = pixelConfig.customTrackingCode;
          Array.from(div.children).forEach(child => document.head.appendChild(child));
        }
      }
    }
  } catch (err) {
    console.log('[Pixel] Usando modo offline/fallback para rastreamento:', err.message);
  }
}

// ------------------------------------------------------
// DISPARADOR UNIVERSAL DE EVENTOS (CLIENT + BACKEND)
// ------------------------------------------------------

export function trackPixelEvent(eventName, params = {}, metaStandardEvent = null) {
  const visitorId = getVisitorId();
  let utms = {};
  try {
    utms = sessionAttribution(location.search, sessionStorage);
  } catch {}

  const enrichedPayload = {
    ...params,
    ...utms,
    visitorId,
    timestamp: new Date().toISOString(),
    url: location.href
  };

  console.log(`🎯 [Pixel Track] ${eventName}:`, enrichedPayload);

  // 1. Meta Pixel (Facebook Ads)
  try {
    if (window.fbq) {
      if (metaStandardEvent) {
        window.fbq('track', metaStandardEvent, params);
      }
      // Sempre dispara o evento custom exato do funil
      window.fbq('trackCustom', eventName, params);
    }
  } catch (e) {
    console.warn('[Pixel Meta Error]', e);
  }

  // 2. TikTok Pixel
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track(eventName, params);
    }
  } catch (e) {
    console.warn('[Pixel TikTok Error]', e);
  }

  // 3. Google Analytics / gtag
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (e) {
    console.warn('[Pixel GA Error]', e);
  }

  // 4. Backend Dashboard Fastify API (/api/track/event)
  try {
    fetch(`${BACKEND_URL}/api/track/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        event: eventName,
        data: params,
        visitorId,
        utms,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })
    }).catch(() => {});
  } catch {}
}

// ------------------------------------------------------
// OS 11 EVENTOS OFICIAIS DO FUNIL PRE-SELL & CHAT
// ------------------------------------------------------

// 1. Visita na Pre-sell (PageView + PresellView)
export function trackPageView() {
  trackPixelEvent('PageView', { page: 'presell' }, 'PageView');
  trackPixelEvent('PresellView', { page: 'presell' });
}

// 2. Abertura do Chat (Lead ou ChatOpened)
export function trackChatOpened(source = 'main_cta') {
  trackPixelEvent('Lead', { source }, 'Lead');
  trackPixelEvent('ChatOpened', { source });
}

// 3. Viu a Prévia 1 (ViewContent_Preview1)
export function trackPreview1(contentName = 'previa_1') {
  trackPixelEvent('ViewContent_Preview1', { content_name: contentName }, 'ViewContent');
}

// 4. Clique para ver a Prévia 2 (Click_Preview2)
export function trackPreview2Click(choice = 'me_mostra_mais') {
  trackPixelEvent('Click_Preview2', { choice });
}

// 5. Viu a Prévia 2 (ViewContent_Preview2)
export function trackPreview2View(contentName = 'previa_2') {
  trackPixelEvent('ViewContent_Preview2', { content_name: contentName }, 'ViewContent');
}

// 6. Solicitou o Presentinho (Click_GiftRequest)
export function trackGiftRequest(choice = 'quero_presente') {
  trackPixelEvent('Click_GiftRequest', { choice });
}

// 7. Recebeu o Presentinho (ViewContent_Gift)
export function trackGift(contentName = 'presentinho_vip') {
  trackPixelEvent('ViewContent_Gift', { content_name: contentName }, 'ViewContent');
}

// 8. Visualizou Planos (ViewContent_Plans)
export function trackPlansView() {
  trackPixelEvent('ViewContent_Plans', { content_name: 'tabela_planos' }, 'ViewContent');
}

// 9. Escolheu Plano / Pix (InitiateCheckout)
export function trackInitiateCheckout(planKey = '15d', value = 14.90) {
  trackPixelEvent(
    'InitiateCheckout',
    {
      value,
      currency: 'BRL',
      content_name: `plano_${planKey}`,
      plan: planKey
    },
    'InitiateCheckout'
  );
}

// 10. Copiou Código Pix (PixCodeCopied)
export function trackPixCopied(value = 14.90) {
  trackPixelEvent('PixCodeCopied', { value, currency: 'BRL' });
}

// 11. Clicou no botão oficial Pushin Pay (Click_PushinPay)
export function trackPushinPayClick(planKey = '15d', value = 14.90) {
  trackPixelEvent('Click_PushinPay', { plan: planKey, value, currency: 'BRL' });
}

// 12. Clicou em "Já fiz o Pix / Conferir Status" (PaymentCheckRequested)
export function trackPaymentCheckRequested(planKey = '15d') {
  trackPixelEvent('PaymentCheckRequested', { plan: planKey });
}

// 13. Pagamento Aprovado (Purchase)
export function trackPurchase(value = 14.90, transactionId = '') {
  trackPixelEvent(
    'Purchase',
    {
      value,
      currency: 'BRL',
      transaction_id: transactionId || `tx_${Date.now()}`
    },
    'Purchase'
  );
}

// 9. Upsell 1 - App Exclusivo (Upsell1_View / Upsell1_Purchase)
export function trackUpsell1View(value = 19.90) {
  trackPixelEvent('Upsell1_View', { value, currency: 'BRL' });
}

export function trackUpsell1Purchase(value = 19.90) {
  trackPixelEvent('Upsell1_Purchase', { value, currency: 'BRL' }, 'Purchase');
}

// 10. Upsell 2 - Sorteio (Upsell2_View / Upsell2_Purchase)
export function trackUpsell2View(value = 9.90) {
  trackPixelEvent('Upsell2_View', { value, currency: 'BRL' });
}

export function trackUpsell2Purchase(value = 9.90) {
  trackPixelEvent('Upsell2_Purchase', { value, currency: 'BRL' }, 'Purchase');
}

// 11. Redirecionamento Telegram (CompleteRegistration)
export function trackCompleteRegistration(destination = 'telegram_vip') {
  trackPixelEvent(
    'CompleteRegistration',
    { destination },
    'CompleteRegistration'
  );
}

// Expõe globalmente
if (typeof window !== 'undefined') {
  window.CarolTracking = {
    init: initPixelTracking,
    track: trackPixelEvent,
    trackPageView,
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
    getVisitorId
  };

  // Inicializa automaticamente
  initPixelTracking();
}
