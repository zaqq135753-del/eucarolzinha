// ======================================================
// CAROLZINHA PRIVÉ — CONFIGURAÇÃO CENTRAL
// ======================================================

// Destino principal do funil
export const TELEGRAM_BOT_URL = 'https://t.me/eucarolzinha_bot';

// ======================================================
// COMPATIBILIDADE TEMPORÁRIA
// ======================================================
// O app.js atual ainda utiliza nomes antigos relacionados ao WhatsApp.
// Mantemos estes exports temporariamente para não quebrar o site.
// Apesar do nome, todos eles agora apontam para o Telegram.

export const DEFAULT_WHATSAPP_MESSAGE = '';

export const DEFAULT_WHATSAPP_URL = TELEGRAM_BOT_URL;

export const whatsappConfig = {
  url: TELEGRAM_BOT_URL,
  shortUrl: TELEGRAM_BOT_URL,
  number: '',
  message: ''
};

// ======================================================
// CONFIGURAÇÃO DE CONTATO
// ======================================================

export const contactConfig = {
  platform: 'telegram',
  url: TELEGRAM_BOT_URL,
  username: 'eucarolzinha_bot'
};

// ======================================================
// CONFIGURAÇÃO PRINCIPAL DO SITE
// ======================================================

export const siteConfig = {
  creatorName: 'Carolina Satler',

  headline: 'Vem me conhecer.',
  headlineEmphasis: 'Sem censura.',

  description:
    'Gostou do que viu? Isso é só um aperitivo... o melhor de mim eu deixei separado no meu acesso privado. 🔥😈',

  cta: 'Quero ver mais 👀',

  disclosure:
    'Conteúdo exclusivo +18 · Acesso privado pelo Telegram.',

  heroImage: '',
  heroVideo: '/assets/darkredtartbarnowl.mp4'
};

// ======================================================
// OFERTAS DE CHAMADA
// ======================================================

export const callOffers = [
  {
    id: 'call15',
    minutes: 15,
    price: '29,90',
    checkout: ''
  },
  {
    id: 'call30',
    minutes: 30,
    price: '49,90',
    checkout: ''
  }
];