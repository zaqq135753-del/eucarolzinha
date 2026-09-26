// Configuração geral da Carolzinha Privé
export const DEFAULT_WHATSAPP_MESSAGE = 'Oi Carol! Vim pelo seu site e quero ter acesso aos conteúdos ou chamada de vídeo 💋';
export const DEFAULT_WHATSAPP_URL = `https://wa.me/message/AYCUNLYYIOSZO1?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;

export const whatsappConfig = {
  url: DEFAULT_WHATSAPP_URL,
  shortUrl: 'https://wa.me/message/AYCUNLYYIOSZO1',
  message: DEFAULT_WHATSAPP_MESSAGE
};

export const siteConfig = {
  creatorName: 'Carolina Satler',
  headline: 'Vem me conhecer.',
  headlineEmphasis: 'Mais de perto.',
  description: 'Sem censura, sem filtros e do jeitinho que você sempre quis me ver. Me chama no WhatsApp para liberar seu acesso VIP, vídeos sem censura e agendar nossa chamada ao vivo.',
  cta: 'Falar com a Carol no WhatsApp 💬',
  disclosure: 'Conteúdo adulto exclusivo pago · Sigilo garantido no extrato.',
  heroImage: '',
  heroVideo: '/assets/darkredtartbarnowl.mp4'
};

export const callOffers = [{id:'call15',minutes:15,price:'29,90',checkout:''},{id:'call30',minutes:30,price:'49,90',checkout:''}];

