// Configuração do funil da pressel integrado ao Telegram e canais de prévias.
export const funnelConfig={
 main:{
  bot:'https://t.me/eucarolzinha_bot?start=presell',
  price:null,
  checkout:'',
  title:'Meu espaço, mais perto de você.',
  items:['Fotos e vídeos do pacote','Acesso ao VIP exclusivo no Telegram','Entrada na área de membros']
 },
 starter:{
  price:16.90,
  bot:'https://t.me/+N0qDwwVScTIxNGMx',
  title:'Entrar no meu canal gratuito de prévias'
 },
  stories:[
   {src:'/assets/darkredtartbarnowl.mp4',poster:'/assets/story-3.webp',title:'Apresentação Privada 🔞'},
   {src:'/assets/belovedprestigioussandbarshark.mp4',poster:'/assets/short-photo-1.webp',title:'Provocando no espelho 🔥'},
   {src:'/assets/trickyturbulentbrahmancow.mp4',poster:'/assets/bonus-photo.webp',title:'Deitada na cama me tocando 🤤'},
   {src:'/assets/video-2.mp4',poster:'/assets/short-photo-2.webp',title:'Sem censura no banho 💦'}
  ]
};
export function httpsLink(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
