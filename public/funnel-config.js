// Configure before making this review route the public homepage.
export const funnelConfig={
 main:{bot:'',price:null,checkout:'',title:'Meu espaço, mais perto de você.',items:['Fotos e vídeos do pacote','Acesso ao WhatsApp informado na oferta','Entrada na área de membros']},
 starter:{price:16.90,bot:'',title:'Comece com uma seleção menor.'},
 stories:[{src:'/assets/story-3.mp4',poster:'/assets/story-3.webp',title:'Um primeiro olhar'},{src:'/assets/story-2.mp4',poster:'/assets/story-2.webp',title:'Um pouco de sol'},{src:'/assets/story-1.mp4',poster:'/assets/story-1.webp',title:'Mais uma prévia'}]
};
export function httpsLink(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
