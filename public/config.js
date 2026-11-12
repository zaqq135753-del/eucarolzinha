// ======================================================
// MIA VALENTE PRIVÉ — CONFIGURAÇÃO CENTRAL
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
  creatorName: 'Mia Valente',

  headline: 'Conheça meu espaço privado.',
  headlineEmphasis: 'Mia Valente Privé.',

  description:
    'Conheça a oferta de fotos, vídeos e acesso ao contato de WhatsApp por R$ 9,90. Confira as condições no Telegram.',

  cta: 'Ver oferta de R$ 9,90',

  disclosure:
    'Somente maiores de 18 anos. Pagamento e entrega pelo Telegram. Contato sujeito às condições informadas.',

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