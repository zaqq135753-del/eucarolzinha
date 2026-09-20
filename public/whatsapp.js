import {whatsappConfig} from './config.js';
export function whatsappUrl(config=whatsappConfig){const number=config.number.replace(/[\s()+-]/g,'');return /^[1-9]\d{9,14}$/.test(number)?`https://wa.me/${number}?text=${encodeURIComponent(config.message)}`:null;}
