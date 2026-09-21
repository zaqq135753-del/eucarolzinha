// Configure before making this review route the public homepage.
export const funnelConfig={
 main:{bot:'https://t.me/eucarolzinha_bot?start=site',price:25.90,checkout:'',title:'Meu espaço VIP sem censura, direto com você.',items:['Fotos e vídeos íntimos sem censura','Áudios picantes e conversas privativas','Atualizações diárias e exclusivas','Acesso 100% sigiloso e discreto']},
 starter:{price:7.90,bot:'https://t.me/+kiwEPij2CwFhMzNh',title:'Entre no meu canal de prévias gratuitas no Telegram.'},
 stories:[{src:'/assets/story-3.mp4',poster:'/assets/story-3.webp',title:'Um primeiro olhar'},{src:'/assets/story-2.mp4',poster:'/assets/story-2.webp',title:'Um pouco de sol'},{src:'/assets/story-1.mp4',poster:'/assets/story-1.webp',title:'Mais uma prévia'}]
};
export function httpsLink(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
