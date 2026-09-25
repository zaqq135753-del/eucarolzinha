// Configuração do funil da pressel integrado ao WhatsApp.
export const funnelConfig={
  main:{
    bot:'https://wa.me/5531991372791?text=' + encodeURIComponent('oii Carol, te vi no tiktok e quero ver seus conteúdos sem censura 🙈🔥'),
    price:null,
    checkout:'',
    title:'Meu espaço, mais perto de você.',
    items:['Fotos e vídeos do pacote','Acesso ao VIP exclusivo no WhatsApp','Atendimento 1x1']
  },
  starter:{
    price:16.90,
    bot:'https://wa.me/5531991372791?text=' + encodeURIComponent('oii Carol, te vi no tiktok e quero ver seus conteúdos sem censura 🙈🔥'),
    title:'Liberar acesso no WhatsApp'
  },
  stories:[
    {src:'/assets/video-2.mp4',title:'Na intimidade sem filtro 💦'},
    {src:'/assets/belovedprestigioussandbarshark.mp4',title:'Provocando no espelho 🔥'},
    {src:'/assets/trickyturbulentbrahmancow.mp4',title:'Deitada na cama me tocando 🤤'}
  ]
};
export function httpsLink(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
